import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client'; 
import { CreateEncargadoDto, UpdateEncargadoDto } from './dto/create-encargadoscooperativa.dto';

@Injectable()
export class EncargadoService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // --- MAPPER (Backend -> Frontend) ---
  private mapToResponse(data: any): any {
    const p = data.persona;
    const u = p.user; // Usuario asociado a la persona

    const primerNombre = p.primer_nombre;
    const otrosNombres = [p.segundo_nombre, p.tercer_nombre].filter(Boolean).join(' ');
    const apellidos = `${p.primer_apellido} ${p.segundo_apellido || ''}`.trim();

    return {
      id: data.id, // ID Encargado (ej. ENC-001)
      personaId: p.id,
      
      nombreCompleto: `${primerNombre} ${otrosNombres} ${apellidos}`.trim(),
      nombres: `${primerNombre} ${otrosNombres}`.trim(),
      apellidos: apellidos,
      
      email: u ? u.email : 'Sin Usuario',
      fotoUrl: p.url_Foto,
      fechaRegistro: p.fecha_de_creacion,

      cooperativas: data.cooperativas.map((c: any) => ({
        id: c.codigoCoop,
        nombre: c.nombre_cooperativa
      }))
    };
  }

  // --- CRUD ---

  async findAll() {
    const data = await this.prisma.encargado_Cooperativa.findMany({
      include: {
        persona: {
            include: { user: true } 
        },
        cooperativas: true 
      }
    });
    return data.map(item => this.mapToResponse(item));
  }

  async findOne(id: string) {
    const data = await this.prisma.encargado_Cooperativa.findUnique({
      where: { id },
      include: {
        persona: { include: { user: true } },
        cooperativas: true
      }
    });
    if (!data) throw new NotFoundException('Encargado no encontrado');
    return this.mapToResponse(data);
  }

  async create(dto: CreateEncargadoDto) {
    const { cooperativasIds, email, id: idEncargado, ...personaData } = dto;

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Crear Persona
        const nuevaPersona = await tx.persona.create({
          data: {
            id: crypto.randomUUID(),
            primer_nombre: personaData.primer_nombre,
            segundo_nombre: personaData.segundo_nombre,
            tercer_nombre: personaData.tercer_nombre,
            primer_apellido: personaData.primer_apellido,
            segundo_apellido: personaData.segundo_apellido,
            url_Foto: personaData.url_Foto,
            role: 'ENCARGADO_COOPERATIVA' as Role,
          }
        });

        // 2. Crear Usuario (Login)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('123456', salt);

        await tx.user.create({
          data: {
            email: email,
            username: email.split('@')[0], 
            password: hash,
            persona_id: nuevaPersona.id,
            esta_activo: true 
          }
        });

        // 3. Crear Encargado
        await tx.encargado_Cooperativa.create({
          data: {
            id: idEncargado, 
            persona_id: nuevaPersona.id
          }
        });

        // 4. Vincular Cooperativas
        if (cooperativasIds && cooperativasIds.length > 0) {
          await tx.cooperativa.updateMany({
            where: { codigoCoop: { in: cooperativasIds } },
            data: { id_encargado: idEncargado }
          });
        }
      });

      this.eventsGateway.broadcast('encargados-table-updated');
      return { message: 'Encargado creado exitosamente' };

    } catch (error) {
      console.error("Error creating encargado:", error); // 🔥 Importante para debug
      throw new InternalServerErrorException('Error al crear encargado. Revisa logs.');
    }
  }

  async update(id: string, dto: UpdateEncargadoDto) {
    const { cooperativasIds, email, ...personaData } = dto;

    const current = await this.prisma.encargado_Cooperativa.findUnique({
        where: { id },
        select: { persona_id: true }
    });

    if (!current) throw new NotFoundException('Encargado no existe');

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Actualizar Persona
        await tx.persona.update({
            where: { id: current.persona_id },
            data: {
                primer_nombre: personaData.primer_nombre,
                segundo_nombre: personaData.segundo_nombre,
                tercer_nombre: personaData.tercer_nombre,
                primer_apellido: personaData.primer_apellido,
                segundo_apellido: personaData.segundo_apellido,
                url_Foto: personaData.url_Foto,
            }
        });

        // 2. Actualizar Email Usuario
        if (email) {
            await tx.user.updateMany({ 
                where: { persona_id: current.persona_id },
                data: { email: email }
            });
        }

        // 3. Actualizar Relación con Cooperativas
        if (cooperativasIds) {
            // A. Primero: LIBERAR las que este encargado tenía pero ya no están en la lista nueva
            // Usamos null (mejor práctica) o "SIN_ASIGNAR" si aplicaste el parche SQL anterior
            await tx.cooperativa.updateMany({
                where: { 
                    id_encargado: id, 
                    codigoCoop: { notIn: cooperativasIds } 
                },
                data: { id_encargado: null } // ⚠️ Cambia a "SIN_ASIGNAR" si tu BD no acepta NULL
            });

            // B. Segundo: ASIGNAR las nuevas
            await tx.cooperativa.updateMany({
                where: { codigoCoop: { in: cooperativasIds } },
                data: { id_encargado: id }
            });
        }
      });

      this.eventsGateway.broadcast('encargados-table-updated');
      // También avisamos a la tabla de cooperativas para que se refresque
      this.eventsGateway.broadcast('cooperativas-table-updated'); 
      
      return { message: 'Actualizado correctamente' };
    } catch (error) {
        console.error("Error updating encargado:", error);
        throw new InternalServerErrorException('Error actualizando encargado');
    }
  }

  async remove(id: string) {
      try {
          const current = await this.prisma.encargado_Cooperativa.findUnique({ where: { id }});
          if (!current) throw new NotFoundException('No encontrado');
          
          await this.prisma.$transaction(async (tx) => {
             // 1. Desvincular cooperativas (Evita el error de FK)
             await tx.cooperativa.updateMany({
                 where: { id_encargado: id },
                 data: { id_encargado: null } // ⚠️ Cambia a "SIN_ASIGNAR" solo si NO hiciste la columna nullable
             });
             
             // 2. Borrar Encargado
             await tx.encargado_Cooperativa.delete({ where: { id } });
             
             // 3. Opcional: Borrar usuario y persona para limpiar la BD
             // await tx.user.deleteMany({ where: { persona_id: current.persona_id }});
             // await tx.persona.delete({ where: { id: current.persona_id }});
          });

          this.eventsGateway.broadcast('encargados-table-updated');
          this.eventsGateway.broadcast('cooperativas-table-updated'); 
          
          return { message: 'Eliminado correctamente' };
      } catch(error) {
          console.error("Error deleting encargado:", error);
          // Buscamos si es error de FK específico
          if (error.code === 'P2003') { 
              throw new InternalServerErrorException('No se puede eliminar: tiene datos relacionados pendientes.');
          }
          throw new InternalServerErrorException('Error al eliminar encargado');
      }
  }
}