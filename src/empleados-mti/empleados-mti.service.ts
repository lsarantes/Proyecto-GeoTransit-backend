import { Injectable } from '@nestjs/common';
import { CreateEmpleadosMtiDto } from './dto/create-empleados-mti.dto';
import { UpdateEmpleadosMtiDto } from './dto/update-empleados-mti.dto';

@Injectable()
export class EmpleadosMtiService {
  create(createEmpleadosMtiDto: CreateEmpleadosMtiDto) {
    return 'This action adds a new empleadosMti';
  }

  findAll() {
    return `This action returns all empleadosMti`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empleadosMti`;
  }

  update(id: number, updateEmpleadosMtiDto: UpdateEmpleadosMtiDto) {
    return `This action updates a #${id} empleadosMti`;
  }

  remove(id: number) {
    return `This action removes a #${id} empleadosMti`;
  }
}
