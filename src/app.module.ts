import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusesModule } from './buses/buses.module';
import { CooperativasModule } from './cooperativas/cooperativas.module';
import { PersonasModule } from './personas/personas.module';
import { ConductoresModule } from './conductores/conductores.module';
import { TelefonosModule } from './telefonos/telefonos.module';
import { EncargadoscooperativasModule } from './encargadoscooperativas/encargadoscooperativas.module';
import { EmpleadosMtiModule } from './empleados-mti/empleados-mti.module';
import { PasajerosModule } from './pasajeros/pasajeros.module';
import { RutasModule } from './rutas/rutas.module';
import { CooperativasRutasModule } from './cooperativas_rutas/cooperativas_rutas.module';
import { BahiasModule } from './bahias/bahias.module';
import { RutasBahiasModule } from './rutas_bahias/rutas_bahias.module';
import { AlertasModule } from './alertas/alertas.module';
import { UsersModule } from './Users/users.module';

@Module({
  imports: [UsersModule, BusesModule, CooperativasModule, PersonasModule, ConductoresModule, TelefonosModule, EncargadoscooperativasModule, EmpleadosMtiModule, PasajerosModule, RutasModule, CooperativasRutasModule, BahiasModule, RutasBahiasModule, AlertasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
