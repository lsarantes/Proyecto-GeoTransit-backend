import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CooperativaController } from './cooperativas.controller';
import { CooperativaService } from './cooperativas.service';
import { EventsGateway } from 'src/events/events.gateway';
// Si el EventsGateway está en AppModule y es Global, no necesitas importarlo aquí si usas @Global()
// Si no es global, impórtalo o importa el EventsModule.
// Asumiremos que el Gateway está disponible globalmente o a través de un módulo.

@Module({
  imports: [PrismaModule], 
  controllers: [CooperativaController],
  providers: [CooperativaService, EventsGateway],
})
export class CooperativaModule {}