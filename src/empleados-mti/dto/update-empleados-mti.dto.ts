import { PartialType } from '@nestjs/swagger';
import { CreateEmpleadosMtiDto } from './create-empleados-mti.dto';

export class UpdateEmpleadosMtiDto extends PartialType(CreateEmpleadosMtiDto) {}
