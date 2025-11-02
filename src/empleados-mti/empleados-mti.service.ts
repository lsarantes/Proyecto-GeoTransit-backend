import { Injectable } from '@nestjs/common';
import { CreateEmpleadosMtiDto } from './dto/create-empleados-mti.dto';
import { UpdateEmpleadosMtiDto } from './dto/update-empleados-mti.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpleadosMtiService {

  constructor( private readonly prisma: PrismaService) {}
  
  create(createEmpleadosMtiDto: CreateEmpleadosMtiDto) {
    const { bahias, ...empleadoData } = createEmpleadosMtiDto;  
    return this.prisma.empleado_MTI.create({ data: empleadoData });
  }

  findAll() {
    return this.prisma.empleado_MTI.findMany();
  }

  findOne(id_empleado_mti: string) {
    return this.prisma.empleado_MTI.findUnique({ where: { id_empleado_mti} });
  }
  
  update(id_empleado_mti: string, updateEmpleadosMtiDto: UpdateEmpleadosMtiDto) {
    const { bahias, ...empleadoData } = updateEmpleadosMtiDto;  
    return this.prisma.empleado_MTI.update({ where: { id_empleado_mti }, data: empleadoData, });
  }
  
  remove(id_empleado_mti: string) {
    return this.prisma.empleado_MTI.delete({ where: { id_empleado_mti} });
  }
}
