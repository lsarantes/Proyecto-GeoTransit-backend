import { Injectable } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RutasService {

  constructor( private readonly prisma: PrismaService) {}
  
  create(createRutaDto: CreateRutaDto) {
  const { cooperativa, bahias, alertas, ...rutaData } = createRutaDto;
  return this.prisma.ruta.create({ data: rutaData });
  }

  findAll() {
    return this.prisma.ruta.findMany();
  }

  findOne(nombre_ruta: string) {
    return this.prisma.ruta.findUnique({ where: { nombre_ruta } });
  }
  
  update(nombre_ruta: string, updateRutaDto: UpdateRutaDto) {
    const { cooperativa, bahias, alertas, ...rutaData } = updateRutaDto;
    return this.prisma.ruta.update({ where: { nombre_ruta }, data: rutaData, });
  }
  
  remove(nombre_ruta: string) {
    return this.prisma.ruta.delete({ where: { nombre_ruta } });
  }
}
