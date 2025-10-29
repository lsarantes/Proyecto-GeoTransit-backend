import { Module } from '@nestjs/common';
import { CooperativasRutasService } from './cooperativas_rutas.service';
import { CooperativasRutasController } from './cooperativas_rutas.controller';

@Module({
  controllers: [CooperativasRutasController],
  providers: [CooperativasRutasService],
})
export class CooperativasRutasModule {}
