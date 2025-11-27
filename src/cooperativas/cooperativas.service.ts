import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCooperativaDto, UpdateCooperativaDto } from './dto/create-cooperativa.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { CooperativaResponse } from 'src/interfaces/cooperativa-response.interface';

@Injectable()
export class CooperativaService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  private mapToResponse(data: any): CooperativaResponse {
    const persona = data.encargado?.persona;
    const nombreCompleto = persona 
        ? `${persona.primer_nombre} ${persona.primer_apellido}`.trim() 
        : 'Sin Asignar';

    return {
      codigoCoop: data.codigoCoop,
      nombre_cooperativa: data.nombre_cooperativa,
      direccion: data.direccion,
      ubicacion: {
        lat: data.latitud_ubicacion,
        lng: data.logitud_ubicacion,
      },
      contacto: {
        telefono: data.no_telefonico,
        pais: data.cod_pais,
      },
      fotoUrl: data.url_foto_perfil,
      fechaCreacion: data.fecha_de_creacion,
      encargado: {
        id: data.id_encargado,
        nombreCompleto: nombreCompleto,
        fotoUrl: persona?.url_Foto || null,
      },
      rutas: data.ruta?.map((r: any) => ({
        id: r.ruta.id, // ✅ CORREGIDO: Usa Ruta.id
        nombre: r.ruta.nombre_ruta,
      })) || [],
    };
  }

  async findAll(): Promise<CooperativaResponse[]> {
    const data = await this.prisma.cooperativa.findMany({
      include: {
        encargado: { include: { persona: true } },
        ruta: { include: { ruta: true } }
      }
    });
    return data.map(item => this.mapToResponse(item));
  }

  async findOne(id: string): Promise<CooperativaResponse> {
    const data = await this.prisma.cooperativa.findUnique({
      where: { codigoCoop: id },
      include: {
        encargado: { include: { persona: true } },
        ruta: { include: { ruta: true } }
      }
    });

    if (!data) throw new NotFoundException(`Cooperativa con ID ${id} no encontrada`);
    return this.mapToResponse(data);
  }

  async create(createDto: CreateCooperativaDto) {
    const { rutasIds, ...coopData } = createDto;

    try {
      const result = await this.prisma.cooperativa.create({
        data: {
          ...coopData,
          fecha_de_creacion: new Date(coopData.fecha_de_creacion),
          // Creación de relaciones N:N en tabla intermedia Cooperativa_Ruta
          ruta: rutasIds ? {
             create: rutasIds.map(rutaId => ({
                 ruta_id: rutaId // ✅ CORREGIDO: Insertamos directo el ID de la ruta
             }))
          } : undefined
        },
      });

      this.eventsGateway.broadcast('cooperativas-table-updated');
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear cooperativa');
    }
  }

  async update(id: string, updateDto: UpdateCooperativaDto) {
    const { rutasIds, ...coopData } = updateDto;
    const dataToUpdate: any = { ...coopData };
    
    if (coopData.fecha_de_creacion) {
        dataToUpdate.fecha_de_creacion = new Date(coopData.fecha_de_creacion);
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.cooperativa.update({
          where: { codigoCoop: id },
          data: dataToUpdate,
        });

        if (rutasIds) {
          // Borrar relaciones viejas
          await prisma.cooperativa_Ruta.deleteMany({
            where: { cooperativa_id: id } 
          });

          // Crear nuevas relaciones
          if (rutasIds.length > 0) {
            await prisma.cooperativa_Ruta.createMany({
                data: rutasIds.map(rutaId => ({
                    cooperativa_id: id,
                    ruta_id: rutaId
                }))
            });
          }
        }
      });

      this.eventsGateway.broadcast('cooperativas-table-updated');
      return { message: 'Cooperativa actualizada correctamente' };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar cooperativa');
    }
  }

  async remove(id: string) {
    try {
        await this.prisma.cooperativa_Ruta.deleteMany({
            where: { cooperativa_id: id }
        });

        await this.prisma.cooperativa.delete({
            where: { codigoCoop: id },
        });

        this.eventsGateway.broadcast('cooperativas-table-updated');
        return { message: 'Cooperativa eliminada' };
    } catch (error) {
        throw new InternalServerErrorException('No se pudo eliminar');
    }
  }
}