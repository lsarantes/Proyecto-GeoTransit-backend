import { Module } from '@nestjs/common';
import { EncargadoController } from './encargado.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EncargadoService } from './encargado.service';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  controllers: [EncargadoController],
  providers: [EncargadoService, EventsGateway],
  imports: [PrismaModule],
})
export class EncargadoscooperativasModule {}
