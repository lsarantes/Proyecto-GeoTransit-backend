import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';
import { CreateBusDto, UpdateBusDto } from './dto/create-bus.dto';
import { BusResponse } from 'src/interfaces/bus-response.interface';

@Injectable()
export class BusesService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // --- MAPPER ---
  private mapToResponse(data: any): BusResponse {
    const persona = data.conductor?.persona;
    const nombreConductor = persona 
        ? `${persona.primer_nombre} ${persona.primer_apellido}`.trim() 
        : 'Sin Asignar';

    return {
      placa: data.placa,
      modelo: data.modelo,
      velocidad: data.velocidad,
      capacidad: data.capacidad_de_pasajeros,
      
      ubicacion: {
        lat: data.latitud_actual,
        lng: data.longitud_actual,
        ultimaActualizacion: data.fecha_hora_ultima_ubicacion,
        estado: data.estado_ubicacion,
      },

      estadoOperativo: data.estado_bus,

      conductor: data.conductor ? {
          id: data.conductor.id,
          nombreCompleto: nombreConductor
      } : null,
    };
  }

  // --- CRUD ---

  async findAll() {
    const data = await this.prisma.bus.findMany({
      include: {
        conductor: { include: { persona: true } } // Traemos datos del conductor
      }
    });
    return data.map(item => this.mapToResponse(item));
  }

  async findOne(id: string) {
    const data = await this.prisma.bus.findUnique({
      where: { placa: id },
      include: {
        conductor: { include: { persona: true } }
      }
    });
    if (!data) throw new NotFoundException('Bus no encontrado');
    return this.mapToResponse(data);
  }

  async create(dto: CreateBusDto) {
    try {
      const result = await this.prisma.bus.create({
        data: {
          ...dto,
          fecha_hora_ultima_ubicacion: new Date(dto.fecha_hora_ultima_ubicacion),
        }
      });

      this.eventsGateway.broadcast('buses-table-updated');
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear bus');
    }
  }

  async update(id: string, dto: UpdateBusDto) {
    const dataToUpdate: any = { ...dto };
    
    if (dto.fecha_hora_ultima_ubicacion) {
        dataToUpdate.fecha_hora_ultima_ubicacion = new Date(dto.fecha_hora_ultima_ubicacion);
    }

    try {
      await this.prisma.bus.update({
        where: { placa: id },
        data: dataToUpdate
      });

      this.eventsGateway.broadcast('buses-table-updated');
      return { message: 'Bus actualizado' };
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar bus');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.bus.delete({ where: { placa: id } });
      this.eventsGateway.broadcast('buses-table-updated');
      return { message: 'Bus eliminado' };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar bus');
    }
  }
}