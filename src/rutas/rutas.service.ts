import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import { CreateRutaDto, UpdateRutaDto } from './dto/create-ruta.dto';
import { RutaResponse } from 'src/interfaces/ruta-response.interface';

@Injectable()
export class RutaService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // --- MAPPER ---
  private mapToResponse(data: any): RutaResponse {
    return {
      id: data.id,
      nombre: data.nombre_ruta,
      origen: {
        lat: data.origen_latitud,
        lng: data.origen_longitud,
      },
      destino: {
        lat: data.destino_latitud,
        lng: data.destino_longitud,
      },
      fechaCreacion: data.fecha_creacion,
      
      // Mapeo de relaciones N:N (a través de tablas intermedias)
      cooperativas: data.cooperativa?.map((cr: any) => ({
        id: cr.cooperativa.codigoCoop,
        nombre: cr.cooperativa.nombre_cooperativa
      })) || [],

      bahias: data.bahias?.map((rb: any) => ({
        id: rb.bahia.id,
        nombre: rb.bahia.nombre_bahia
      })) || [],
    };
  }

  // --- CRUD ---

  async findAll() {
    const data = await this.prisma.ruta.findMany({
      include: {
        cooperativa: { include: { cooperativa: true } }, // Relación Cooperativa_Ruta
        bahias: { include: { bahia: true } }             // Relación RutaBahia
      }
    });
    return data.map(item => this.mapToResponse(item));
  }

  async findOne(id: string) {
    const data = await this.prisma.ruta.findUnique({
      where: { id },
      include: {
        cooperativa: { include: { cooperativa: true } },
        bahias: { include: { bahia: true } }
      }
    });
    if (!data) throw new NotFoundException('Ruta no encontrada');
    return this.mapToResponse(data);
  }

  async create(dto: CreateRutaDto) {
    const { cooperativasIds, bahiasIds, ...rutaData } = dto;

    try {
      const result = await this.prisma.ruta.create({
        data: {
          ...rutaData,
          fecha_creacion: new Date(rutaData.fecha_creacion),
          
          // Insertar relaciones N:N
          cooperativa: cooperativasIds ? {
            create: cooperativasIds.map(id => ({ cooperativa_id: id }))
          } : undefined,

          bahias: bahiasIds ? {
            create: bahiasIds.map(id => ({ bahia_id: id }))
          } : undefined
        }
      });

      this.eventsGateway.broadcast('rutas-table-updated');
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear ruta');
    }
  }

  async update(id: string, dto: UpdateRutaDto) {
    const { cooperativasIds, bahiasIds, ...rutaData } = dto;

    const dataToUpdate: any = { ...rutaData };
    if (rutaData.fecha_creacion) {
        dataToUpdate.fecha_creacion = new Date(rutaData.fecha_creacion);
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Actualizar datos básicos
        await tx.ruta.update({
          where: { id },
          data: dataToUpdate
        });

        // 2. Actualizar Cooperativas (Borrar viejas -> Crear nuevas)
        if (cooperativasIds) {
          await tx.cooperativa_Ruta.deleteMany({ where: { ruta_id: id } });
          
          if (cooperativasIds.length > 0) {
             await tx.cooperativa_Ruta.createMany({
               data: cooperativasIds.map(coopId => ({
                 ruta_id: id,
                 cooperativa_id: coopId
               }))
             });
          }
        }

        // 3. Actualizar Bahías (Borrar viejas -> Crear nuevas)
        if (bahiasIds) {
          await tx.rutaBahia.deleteMany({ where: { ruta_id: id } });

          if (bahiasIds.length > 0) {
            await tx.rutaBahia.createMany({
              data: bahiasIds.map(bahiaId => ({
                ruta_id: id,
                bahia_id: bahiaId
              }))
            });
          }
        }
      });

      this.eventsGateway.broadcast('rutas-table-updated');
      return { message: 'Ruta actualizada' };
    } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error al actualizar ruta');
    }
  }

  async remove(id: string) {
    try {
      // Borrar en cascada relaciones manuales
      await this.prisma.$transaction([
          this.prisma.cooperativa_Ruta.deleteMany({ where: { ruta_id: id } }),
          this.prisma.rutaBahia.deleteMany({ where: { ruta_id: id } }),
          this.prisma.ruta.delete({ where: { id } })
      ]);

      this.eventsGateway.broadcast('rutas-table-updated');
      return { message: 'Ruta eliminada' };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar ruta');
    }
  }
}