import { Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BusesService {

  constructor( private readonly prisma: PrismaService) {}

  create(createBusDto: CreateBusDto) {
    return this.prisma.bus.create({data: createBusDto});
  }

  findAll() {
    return this.prisma.bus.findMany();
  }

  findOne(placa: string) {
    return this.prisma.bus.findUnique({where: { placa}});
  }

  update(placa: string, updateBusDto: UpdateBusDto) {
    return this.prisma.bus.update({where: { placa}, data: updateBusDto});
  }

  remove(placa: string) {
  return this.prisma.bus.delete({where: { placa}});  }
}
