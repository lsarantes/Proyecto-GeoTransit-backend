import { Module } from '@nestjs/common';
import { RutasBahiasService } from './rutas_bahias.service';
import { RutasBahiasController } from './rutas_bahias.controller';

@Module({
  controllers: [RutasBahiasController],
  providers: [RutasBahiasService],
})
export class RutasBahiasModule {}
