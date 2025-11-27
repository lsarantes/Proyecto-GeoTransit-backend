import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusesModule } from './buses/buses.module';
import { CooperativaModule } from './cooperativas/cooperativas.module';
import { PersonasModule } from './personas/personas.module';
import { ConductoresModule } from './conductores/conductores.module';
import { EncargadoscooperativasModule } from './encargado/encargado.module';
import { EmpleadosMtiModule } from './empleados-mti/empleados-mti.module';
import { RutasModule } from './rutas/rutas.module';
import { BahiasModule } from './bahias/bahias.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventsGateway } from './events/events.gateway';
import { UserModule } from './users/users.module';

@Module({
  imports: [UserModule, BusesModule, CooperativaModule, PersonasModule, ConductoresModule,  EncargadoscooperativasModule, EmpleadosMtiModule,  RutasModule,  BahiasModule,   PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [EventsGateway,AppService],
})
export class AppModule {}
