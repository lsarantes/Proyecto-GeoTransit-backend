import { Module } from '@nestjs/common';
import { PasajerosService } from './pasajeros.service';
import { PasajerosController } from './pasajeros.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PasajerosController],
  providers: [PasajerosService],
  imports: [PrismaModule],
})
export class PasajerosModule {}
