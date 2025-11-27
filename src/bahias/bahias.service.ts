import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import { BahiaResponse } from 'src/interfaces/bahia-response.interface';
import { CreateBahiaDto, UpdateBahiaDto } from 'src/bahias/dto/create-bahia.dto';

@Injectable()
export class BahiaService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // --- MAPPER ---
  private mapToResponse(data: any): BahiaResponse {
    // Extraer nombre del empleado si existe
    const empleado = data.empleado_mti?.persona;
    const nombreEmpleado = empleado 
        ? `${empleado.primer_nombre} ${empleado.primer_apellido}`.trim() 
        : 'Desconocido';

    return {
      id: data.id,
      nombre: data.nombre_bahia,
      ubicacion: {
        lat: data.ubicacion_latitud,
        lng: data.ubicacion_longitud,
      },
      fotoUrl: data.url_foto,
      fechaCreacion: data.fecha_creada,
      
      creadoPor: data.empleado_mti ? {
          id: data.empleado_mti.id_empleado_mti,
          nombre: nombreEmpleado
      } : null,

      // Mapeo de relación N:N con Rutas
      rutas: data.rutas?.map((rb: any) => ({
        id: rb.ruta.id,
        nombre: rb.ruta.nombre_ruta,
      })) || [],
    };
  }

  // --- CRUD ---

  async findAll() {
    const data = await this.prisma.bahias.findMany({
      include: {
        empleado_mti: { include: { persona: true } }, // Datos del creador
        rutas: { include: { ruta: true } }            // Datos de rutas
      }
    });
    return data.map(item => this.mapToResponse(item));
  }

  async findOne(id: string) {
    const data = await this.prisma.bahias.findUnique({
      where: { id },
      include: {
        empleado_mti: { include: { persona: true } },
        rutas: { include: { ruta: true } }
      }
    });
    if (!data) throw new NotFoundException('Bahía no encontrada');
    return this.mapToResponse(data);
  }

  async create(dto: CreateBahiaDto) {
    const { rutasIds, ...bahiaData } = dto;

    try {
      const result = await this.prisma.bahias.create({
        data: {
          ...bahiaData,
          fecha_creada: new Date(bahiaData.fecha_creada),
          
          // Relación N:N (Tabla RutaBahia)
          rutas: rutasIds ? {
             create: rutasIds.map(rutaId => ({
                 ruta_id: rutaId
             }))
          } : undefined
        }
      });

      this.eventsGateway.broadcast('bahias-table-updated');
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear bahía');
    }
  }

  async update(id: string, dto: UpdateBahiaDto) {
    const { rutasIds, ...bahiaData } = dto;
    
    const dataToUpdate: any = { ...bahiaData };
    if (bahiaData.fecha_creada) {
        dataToUpdate.fecha_creada = new Date(bahiaData.fecha_creada);
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Actualizar datos básicos
        await tx.bahias.update({
          where: { id },
          data: dataToUpdate
        });

        // 2. Actualizar Rutas (Borrar viejas -> Crear nuevas)
        if (rutasIds) {
          // Borrar relaciones existentes para esta bahía
          await tx.rutaBahia.deleteMany({ where: { bahia_id: id } });
          
          // Crear nuevas relaciones
          if (rutasIds.length > 0) {
             await tx.rutaBahia.createMany({
               data: rutasIds.map(rutaId => ({
                 bahia_id: id,
                 ruta_id: rutaId
               }))
             });
          }
        }
      });

      this.eventsGateway.broadcast('bahias-table-updated');
      return { message: 'Bahía actualizada' };
    } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error al actualizar bahía');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.$transaction([
          // Eliminar dependencias N:N primero
          this.prisma.rutaBahia.deleteMany({ where: { bahia_id: id } }),
          // Eliminar Bahía
          this.prisma.bahias.delete({ where: { id } })
      ]);

      this.eventsGateway.broadcast('bahias-table-updated');
      return { message: 'Bahía eliminada' };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar bahía');
    }
  }
}