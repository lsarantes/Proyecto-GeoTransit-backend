import { Injectable } from '@nestjs/common';
import { CreateEncargadoscooperativaDto } from './dto/create-encargadoscooperativa.dto';
import { UpdateEncargadoscooperativaDto } from './dto/update-encargadoscooperativa.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EncargadoscooperativasService {

  constructor( private readonly prisma: PrismaService) {}
  
  create(createEncargadoscooperativaDto: CreateEncargadoscooperativaDto) {
    const { cooperativas, ...encargadoData } = createEncargadoscooperativaDto;
    return this.prisma.encargado_Cooperativa.create({ data: encargadoData });
  }

  findAll() {
    return this.prisma.encargado_Cooperativa.findMany();
  }

  findOne(id: string) {
    return this.prisma.encargado_Cooperativa.findUnique({ where: { id } });
  }
  
  update(id: string, updateEncargadoscooperativaDto: UpdateEncargadoscooperativaDto) {
    const { cooperativas, ...encargadoData } = updateEncargadoscooperativaDto;
    return this.prisma.encargado_Cooperativa.update({ where: { id }, data: encargadoData, });
  }
  
  remove(id: string) {
    return this.prisma.encargado_Cooperativa.delete({ where: { id } });
  }
}
