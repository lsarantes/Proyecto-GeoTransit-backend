import { Injectable } from '@nestjs/common';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertasService {

  constructor(private readonly prisma: PrismaService) {}

  create(createAlertaDto: CreateAlertaDto) {
    return this.prisma.alertas.create({data: createAlertaDto});
  }

  findAll() {
    return this.prisma.alertas.findMany();
  }

  findOne(id_alerta: string) {
    return this.prisma.alertas.findUnique({where: { id_alerta }});
  }

  update(id_alerta: string, updateAlertaDto: UpdateAlertaDto) {
    return this.prisma.alertas.update({where: { id_alerta }, data: updateAlertaDto});
  }

  remove(id_alerta: string) {
    return this.prisma.alertas.delete({where: { id_alerta }});
  }
}
