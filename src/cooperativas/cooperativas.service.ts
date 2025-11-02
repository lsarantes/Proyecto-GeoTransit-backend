import { Injectable } from '@nestjs/common';
import { CreateCooperativaDto } from './dto/create-cooperativa.dto';
import { UpdateCooperativaDto } from './dto/update-cooperativa.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CooperativasService {

  constructor( private readonly prisma: PrismaService) {}

  create(createCooperativaDto: CreateCooperativaDto) {
    const { ruta,  ...cooperativaData } = createCooperativaDto;
   return this.prisma.cooperativa.create({ data: cooperativaData});
  }

  findAll() {
    return this.prisma.cooperativa.findMany();
  }

  findOne(nombre_cooperativa: string) {
    return this.prisma.cooperativa.findUnique({where: { nombre_cooperativa}});
  }

  update(nombre_cooperativa: string, updateCooperativaDto: UpdateCooperativaDto) {
    const { ruta,  ...cooperativaData } = updateCooperativaDto;
    return this.prisma.cooperativa.update({ where: { nombre_cooperativa}, data: cooperativaData, });
  }

  remove(nombre_cooperativa: string) {
    return this.prisma.cooperativa.delete({where: { nombre_cooperativa}});
  }
}
