import { Module } from '@nestjs/common';
import { CooperativasRutasService } from './cooperativas_rutas.service';
import { CooperativasRutasController } from './cooperativas_rutas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CooperativasRutasController],
  providers: [CooperativasRutasService],
  imports: [PrismaModule],
})
export class CooperativasRutasModule {}
