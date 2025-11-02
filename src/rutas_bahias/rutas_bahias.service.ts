import { Injectable } from '@nestjs/common';
import { CreateRutasBahiaDto } from './dto/create-rutas_bahia.dto';
import { UpdateRutasBahiaDto } from './dto/update-rutas_bahia.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RutasBahiasService {

  constructor( private readonly prisma: PrismaService) {}
  
  create(createRutasBahiaDto: CreateRutasBahiaDto) {
    return this.prisma.rutaBahia.create({ data: createRutasBahiaDto});
  }

  findAll() {
    return this.prisma.rutaBahia.findMany();
  }

  findOne(ruta_id: string, bahia_id: string) {
    return this.prisma.rutaBahia.findUnique({ where: {ruta_id_bahia_id: {ruta_id, bahia_id} } });
  }
  
  update(ruta_id: string, bahia_id: string, updateRutasBahiaDto: UpdateRutasBahiaDto) {
    return this.prisma.rutaBahia.update({ where: {ruta_id_bahia_id: {ruta_id, bahia_id} }, data: updateRutasBahiaDto });
  }
  
  remove(ruta_id: string, bahia_id: string) {
    return this.prisma.rutaBahia.delete({ where: {ruta_id_bahia_id: {ruta_id, bahia_id} } });
  }
}
