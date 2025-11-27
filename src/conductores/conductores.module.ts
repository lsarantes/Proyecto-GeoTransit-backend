import { Module } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { ConductoresController } from './conductores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  controllers: [ConductoresController],
  providers: [ConductoresService, EventsGateway],
  imports: [PrismaModule],
})
export class ConductoresModule {}
