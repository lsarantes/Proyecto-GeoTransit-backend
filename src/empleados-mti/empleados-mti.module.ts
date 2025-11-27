import { Module } from '@nestjs/common';
import { EmpleadosMtiService } from './empleados-mti.service';
import { EmpleadosMtiController } from './empleados-mti.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [EmpleadosMtiController],
  providers: [EmpleadosMtiService],
  imports: [PrismaModule],
})
export class EmpleadosMtiModule {}
