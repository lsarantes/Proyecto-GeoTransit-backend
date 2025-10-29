import { Module } from '@nestjs/common';
import { EmpleadosMtiService } from './empleados-mti.service';
import { EmpleadosMtiController } from './empleados-mti.controller';

@Module({
  controllers: [EmpleadosMtiController],
  providers: [EmpleadosMtiService],
})
export class EmpleadosMtiModule {}
