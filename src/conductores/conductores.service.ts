import { Injectable } from '@nestjs/common';
import { CreateConductoreDto } from './dto/create-conductore.dto';
import { UpdateConductoreDto } from './dto/update-conductore.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConductoresService {

  constructor( private readonly prisma: PrismaService) {}
  
  create(createConductoreDto: CreateConductoreDto) {
    const { buses_asignados, ...conductorData } = createConductoreDto;
    return this.prisma.conductor.create({ data: conductorData });
  }

  findAll() {
    return this.prisma.conductor.findMany();
  }

  findOne(id: string) {
    return this.prisma.conductor.findUnique({where: { id }});
  }

  update(id: string, updateConductoreDto: UpdateConductoreDto) {
    const { buses_asignados, ...conductorData } = updateConductoreDto;
    return this.prisma.conductor.update({ where: { id }, data: conductorData, });
  }

  remove(id: string) {
    return this.prisma.conductor.delete({where: { id }});
  }
}
