import { Module } from '@nestjs/common';
import { BahiaService } from './bahias.service';
import { BahiasController } from './bahias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  controllers: [BahiasController],
  providers: [BahiaService, EventsGateway],
  imports: [PrismaModule],
})
export class BahiasModule {}
