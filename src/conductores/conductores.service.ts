import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { CreateConductorDto, UpdateConductorDto } from './dto/create-conductore.dto';

@Injectable()
export class ConductoresService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // --- MAPPER ---
  private mapToResponse(data: any): any {
    const p = data.persona;
    const u = p.user;

    const primerNombre = p.primer_nombre;
    const otrosNombres = [p.segundo_nombre, p.tercer_nombre].filter(Boolean).join(' ');
    const apellidos = `${p.primer_apellido} ${p.segundo_apellido || ''}`.trim();

    return {
      id: data.id,
      personaId: p.id,
      
      nombreCompleto: `${primerNombre} ${otrosNombres} ${apellidos}`.trim(),
      nombres: `${primerNombre} ${otrosNombres}`.trim(),
      apellidos: apellidos,
      
      fotoUrl: p.url_Foto,
      email: u ? u.email : null,
      
      // Contamos los buses asignados
      busesAsignados: data.buses_asignados ? data.buses_asignados.length : 0
    };
  }

  // --- CRUD ---

  async findAll() {
    const data = await this.prisma.conductor.findMany({
      include: {
        persona: { include: { user: true } },
        buses_asignados: true // Para contar cuántos tiene
      }
    });
    return data.map(item => this.mapToResponse(item));
  }

  async findOne(id: string) {
    const data = await this.prisma.conductor.findUnique({
      where: { id },
      include: {
        persona: { include: { user: true } },
        buses_asignados: true
      }
    });
    if (!data) throw new NotFoundException('Conductor no encontrado');
    return this.mapToResponse(data);
  }

  async create(dto: CreateConductorDto) {
    const { email, id: idConductor, ...personaData } = dto;

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
            role: 'CONDUCTORES' as Role, // Ajusta según tu Enum (CONDUCTORES o CONDUCTOR)
          }
        });

        // 2. Crear Usuario (Solo si viene email, para App móvil)
        if (email) {
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
        }

        // 3. Crear Conductor
        await tx.conductor.create({
          data: {
            id: idConductor,
            persona_id: nuevaPersona.id
          }
        });
      });

      this.eventsGateway.broadcast('conductores-table-updated');
      return { message: 'Conductor creado exitosamente' };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear conductor');
    }
  }

  async update(id: string, dto: UpdateConductorDto) {
    const { email, ...personaData } = dto;

    const current = await this.prisma.conductor.findUnique({
        where: { id },
        select: { persona_id: true }
    });

    if (!current) throw new NotFoundException();

    try {
      await this.prisma.$transaction(async (tx) => {
        // Actualizar Persona
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

        // Actualizar Email si existe usuario
        if (email) {
            // Intentamos actualizar, si no existe no pasa nada o podríamos crearlo
            const userExists = await tx.user.findFirst({ where: { persona_id: current.persona_id } });
            
            if (userExists) {
                await tx.user.updateMany({
                    where: { persona_id: current.persona_id },
                    data: { email: email }
                });
            } else {
                // Si no tenía usuario y ahora pone email, lo creamos
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash('123456', salt);
                await tx.user.create({
                    data: {
                        email: email,
                        username: email.split('@')[0],
                        password: hash,
                        persona_id: current.persona_id,
                        esta_activo: true
                    }
                });
            }
        }
      });

      this.eventsGateway.broadcast('conductores-table-updated');
      return { message: 'Conductor actualizado' };
    } catch (error) {
        throw new InternalServerErrorException('Error actualizando conductor');
    }
  }

  async remove(id: string) {
      try {
          // Lógica de eliminación (Soft delete recomendado, aquí hard delete simple)
          const current = await this.prisma.conductor.findUnique({ where: { id }});
          
          await this.prisma.$transaction(async (tx) => {
             // Desvincular buses
             await tx.bus.updateMany({
                 where: { conductor_id: id },
                 data: { conductor_id: "SIN_CONDUCTOR" } // O manejar nulo si schema permite
             });
             
             await tx.conductor.delete({ where: { id } });
             
             // Opcional: Borrar Persona
             if (current) {
                 // await tx.persona.delete({ where: { id: current.persona_id } });
             }
          });

          this.eventsGateway.broadcast('conductores-table-updated');
          return { message: 'Conductor eliminado' };
      } catch(e) {
          throw new InternalServerErrorException('Error al eliminar conductor');
      }
  }
}