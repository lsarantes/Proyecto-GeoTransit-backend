import { Module } from '@nestjs/common';
import { BusesService } from './buses.service';
import { BusesController } from './buses.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  controllers: [BusesController],
  providers: [BusesService, EventsGateway],
  imports: [PrismaModule],
})
export class BusesModule {}
