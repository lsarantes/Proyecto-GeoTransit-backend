import { Module } from '@nestjs/common';
import { RutasBahiasService } from './rutas_bahias.service';
import { RutasBahiasController } from './rutas_bahias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RutasBahiasController],
  providers: [RutasBahiasService],
  imports: [PrismaModule],
})
export class RutasBahiasModule {}
