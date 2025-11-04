import { Injectable } from '@nestjs/common';
import { CreateBahiaDto } from './dto/create-bahia.dto';
import { UpdateBahiaDto } from './dto/update-bahia.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BahiasService {

  constructor( private readonly prisma: PrismaService) {}

  create(createBahiaDto: CreateBahiaDto) {
    const { rutas, pasajeros, ...bahiaData } = createBahiaDto;
    return this.prisma.bahias.create({ data: bahiaData, });
  }

  findAll() {
    return this.prisma.bahias.findMany();
  }

  findOne(nombre_bahia: string) {
    return this.prisma.bahias.findUnique({where: { nombre_bahia }});
  }

  update(nombre_bahia: string, updateBahiaDto: UpdateBahiaDto) {
    const { rutas, pasajeros,  ...bahiaData } = updateBahiaDto;
    return this.prisma.bahias.update({where: { nombre_bahia }, data: bahiaData });
  }

  remove(nombre_bahia: string) {
    return this.prisma.bahias.delete({where: { nombre_bahia }});
  }
}
