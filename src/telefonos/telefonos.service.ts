import { Injectable } from '@nestjs/common';
import { CreateTelefonoDto } from './dto/create-telefono.dto';
import { UpdateTelefonoDto } from './dto/update-telefono.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TelefonosService {

  constructor( private readonly prisma: PrismaService) {}
  
  create(createTelefonoDto: CreateTelefonoDto) {
    return this.prisma.telefono.create({ data: createTelefonoDto });
  }

  findAll() {
    return this.prisma.telefono.findMany();
  }

  findOne(id: number) {
    return this.prisma.telefono.findUnique({ where: { id } });
  }
  
  update(id: number, updateTelefonoDto: UpdateTelefonoDto) {
    return this.prisma.telefono.update({ where: { id }, data: updateTelefonoDto });
  }
  
  remove(id: number) {
    return this.prisma.telefono.delete({ where: { id } });
  }
}
