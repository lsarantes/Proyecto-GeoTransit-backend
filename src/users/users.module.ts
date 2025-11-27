import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from 'src/events/events.gateway';
import { EmpleadoMtiController } from './users.controller';
import { EmpleadoMtiService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [EmpleadoMtiController],
  providers: [EmpleadoMtiService, EventsGateway],
  exports: [EmpleadoMtiService] // Exportamos por si AuthModule lo necesita
})
export class UserModule {}