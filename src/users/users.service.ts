import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import * as bcrypt from 'bcryptjs';
import { Role, TD_NivelAcceso } from '@prisma/client';
import { CreateEmpleadoMtiDto } from './dto/create-user.dto';
import { UpdateEmpleadoMtiDto } from './dto/update-user.dto';

@Injectable()
export class EmpleadoMtiService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // --- MAPPER (Backend -> Frontend) ---
  // Transforma la estructura anidada de Prisma en una fila plana para la Tabla
  private mapToResponse(data: any): any {
    const p = data.persona;
    const u = p.user;

    const primerNombre = p.primer_nombre;
    const otrosNombres = [p.segundo_nombre, p.tercer_nombre].filter(Boolean).join(' ');
    const apellidos = `${p.primer_apellido} ${p.segundo_apellido || ''}`.trim();

    return {
      id: data.id_empleado_mti, // ID del Empleado (ej. MTI-001)
      personaId: p.id,
      
      // Datos visuales para la tabla
      nombreCompleto: `${primerNombre} ${otrosNombres} ${apellidos}`.trim(),
      nombres: `${primerNombre} ${otrosNombres}`.trim(),
      apellidos: apellidos,
      email: u ? u.email : 'Sin Usuario',
      username: u ? u.username : 'N/A',
      fotoUrl: p.url_Foto,
      
      // Datos de Control Administrativo
      nivelAcceso: data.nivel_acceso, // Administrador, Gestor, etc.
      estadoActivo: u ? u.esta_activo : false, // Boolean para el Switch de bloqueo
      ultimoAcceso: u ? u.f_ultimo_acceso : null,
      fechaRegistro: p.fecha_de_creacion,
    };
  }

  // --- CRUD ---

  async findAll() {
    const data = await this.prisma.empleado_MTI.findMany({
      include: {
        persona: {
          include: { user: true }
        }
      },
      orderBy: {
        persona: { fecha_de_creacion: 'desc' }
      }
    });
    return data.map(item => this.mapToResponse(item));
  }

  async findOne(id: string) {
    const data = await this.prisma.empleado_MTI.findUnique({
      where: { id_empleado_mti: id },
      include: {
        persona: { include: { user: true } }
      }
    });
    if (!data) throw new NotFoundException('Empleado MTI no encontrado');
    return this.mapToResponse(data);
  }

  async create(dto: CreateEmpleadoMtiDto) {
    const { email, id: idEmpleado, nivel_acceso, ...personaData } = dto;

    // Verificación previa básica
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictException('El correo ya está en uso');

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
            role: 'EMPLEADO_MTI' as Role, // Rol genérico en Persona
          }
        });

        // 2. Crear Usuario (Login)
        const salt = await bcrypt.genSalt(10);
        // TODO: En producción, generar password aleatorio y enviar por correo.
        const hash = await bcrypt.hash('123456', salt); 

        await tx.user.create({
          data: {
            email: email,
            username: email.split('@')[0], // Generar username base
            password: hash,
            persona_id: nuevaPersona.id,
            esta_activo: true // Por defecto activo al crear
          }
        });

        // 3. Crear Empleado MTI (Entidad Específica)
        await tx.empleado_MTI.create({
          data: {
            id_empleado_mti: idEmpleado,
            nivel_acceso: nivel_acceso,
            persona_id: nuevaPersona.id
          }
        });
      });

      // Notificar a todos los clientes conectados para recargar tablas
      this.eventsGateway.broadcast('empleados-mti-table-updated');
      
      return { message: 'Administrador creado exitosamente' };

    } catch (error) {
      console.error("Error creating empleado MTI:", error);
      if (error.code === 'P2002') throw new ConflictException('El ID o Correo ya existen');
      throw new InternalServerErrorException('Error al crear registro');
    }
  }

  async update(id: string, dto: UpdateEmpleadoMtiDto) {
    const { email, nivel_acceso, esta_activo, password, ...personaData } = dto;

    const current = await this.prisma.empleado_MTI.findUnique({
        where: { id_empleado_mti: id },
        select: { persona_id: true, nivel_acceso: true }
    });

        const user = await this.prisma.user.findUnique({
        where: { persona_id: current?.persona_id || "" },
    }) ;

            const person = await this.prisma.persona.findUnique({
        where: { id: current?.persona_id || "" },
    }) ;
    const idFinal = (user?.id_usuario  )|| 0;
    const dataUser ={}
    if (!current) throw new NotFoundException('Empleado no existe');

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Actualizar datos personales
        if (Object.keys(personaData).length > 0) {
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
        }

        // 2. Actualizar Usuario (Credenciales y Acceso)
        const updateUserData: any = {};
        if (email) updateUserData.email = email;
        if (typeof esta_activo === 'boolean') updateUserData.esta_activo = esta_activo;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateUserData.password = await bcrypt.hash(password, salt);
        }

        if (Object.keys(updateUserData).length > 0) {
            await tx.user.updateMany({ // Usamos updateMany porque la relación es 1:1 vía persona_id
                where: { persona_id: current.persona_id },
                data: updateUserData
            });
        }

        // 3. Actualizar Nivel de Acceso (Rol específico)
        if (nivel_acceso) {
            await tx.empleado_MTI.update({
                where: { id_empleado_mti: id },
                data: { nivel_acceso }
            });
        }

        const dataUser = {
                id_usuario: idFinal,
                username: user?.username,
                email: user?.email,
                estaActivo: user?.esta_activo, 

                // Datos de Persona fusionados
                id_persona: personaData.id,
                nombre: personaData.primer_nombre,
                apellido: (personaData.primer_apellido + " " +personaData.segundo_apellido).trim(),
                nombreCompleto: (personaData.primer_nombre + " " +personaData.segundo_nombre+ " " +personaData.tercer_nombre).trim(),
                role: person?.role,
                fotoUrl: person?.url_Foto,
                nivelAcceso: current.nivel_acceso
            }
      });

      this.eventsGateway.broadcast('empleados-mti-table-updated');
      this.eventsGateway.sendUpdateToUser(idFinal,'profileUpdated',dataUser)
      return { message: 'Perfil administrativo actualizado' };

    } catch (error) {
        console.error("Error updating empleado:", error);
        throw new InternalServerErrorException('Error actualizando datos');
    }
  }

  async remove(id: string) {
      try {
          const current = await this.prisma.empleado_MTI.findUnique({ 
            where: { id_empleado_mti: id },
            include: { persona: true } // Traemos persona para borrar usuario después
          });
          
          if (!current) throw new NotFoundException('No encontrado');
          
          await this.prisma.$transaction(async (tx) => {
             // 1. Borrar Empleado_MTI (Hijo)
             await tx.empleado_MTI.delete({ where: { id_empleado_mti: id } });
             
             // 2. Borrar Usuario asociado (Si existe)
             await tx.user.deleteMany({ where: { persona_id: current.persona_id }});

             // 3. Borrar Persona (Padre)
             await tx.persona.delete({ where: { id: current.persona_id }});
          });

          this.eventsGateway.broadcast('empleados-mti-table-updated');
          return { message: 'Administrador eliminado y accesos revocados' };

      } catch(error) {
          console.error("Error deleting empleado:", error);
          if (error.code === 'P2003') { 
              throw new ConflictException('No se puede eliminar: El usuario gestiona recursos activos (Bahías/Rutas).');
          }
          throw new InternalServerErrorException('Error al eliminar registro');
      }
  }
}