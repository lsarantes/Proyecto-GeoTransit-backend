import { Module } from '@nestjs/common';
import { RutasController } from './rutas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RutaService } from './rutas.service';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  controllers: [RutasController],
  providers: [RutaService, EventsGateway],
  imports: [PrismaModule],
})
export class RutasModule {}
