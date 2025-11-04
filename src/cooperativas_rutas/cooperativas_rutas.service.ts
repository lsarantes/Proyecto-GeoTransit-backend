import { Injectable } from '@nestjs/common';
import { CreateCooperativasRutaDto } from './dto/create-cooperativas_ruta.dto';
import { UpdateCooperativasRutaDto } from './dto/update-cooperativas_ruta.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CooperativasRutasService {

  constructor( private readonly prisma: PrismaService) {}
  
  create(createCooperativasRutaDto: CreateCooperativasRutaDto) {
    const { ruta, cooperativa, ...dataCooperativa } = createCooperativasRutaDto;
    return this.prisma.cooperativa_Ruta.create({ data: dataCooperativa});
  }

  findAll() {
    return this.prisma.cooperativa_Ruta.findMany();
  }

  findOne(cooperativa_id: string, ruta_id: string) {
   return this.prisma.cooperativa_Ruta.findUnique({ where: {cooperativa_id_ruta_id: {cooperativa_id, ruta_id} } });
  }

  update(cooperativa_id: string, ruta_id: string, updateCooperativasRutaDto: UpdateCooperativasRutaDto) {
    const { ruta, cooperativa, ...dataCooperativa } = updateCooperativasRutaDto;
    return this.prisma.cooperativa_Ruta.update({ where: {cooperativa_id_ruta_id: {cooperativa_id, ruta_id} }, data: dataCooperativa });
  }

  remove(cooperativa_id: string, ruta_id: string) {
   return this.prisma.cooperativa_Ruta.delete({ where: {cooperativa_id_ruta_id: {cooperativa_id, ruta_id} } });
  }
}
