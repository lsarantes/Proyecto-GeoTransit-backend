import { Injectable } from '@nestjs/common';
import { CreatePasajeroDto } from './dto/create-pasajero.dto';
import { UpdatePasajeroDto } from './dto/update-pasajero.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PasajerosService {

  constructor( private readonly prisma: PrismaService) {}
  
  create(createPasajeroDto: CreatePasajeroDto) {
    return this.prisma.pasajero.create({ data: createPasajeroDto});
  }

  findAll() {
    return this.prisma.pasajero.findMany();
  }

  findOne(id_pasajero: string) {
    return this.prisma.pasajero.findUnique({ where: { id_pasajero } });
  }
  
  update(id_pasajero: string, updatePasajeroDto: UpdatePasajeroDto) {
    return this.prisma.pasajero.update({  where: { id_pasajero }, data: updatePasajeroDto, });
  }
  
  remove(id_pasajero: string) {
    return this.prisma.pasajero.delete({ where: { id_pasajero } });
  }
}
