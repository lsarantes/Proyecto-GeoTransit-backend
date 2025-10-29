import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
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
import { TdAlertasModule } from './td_alertas/td_alertas.module';
import { TdEstadoBusesModule } from './td_estado_buses/td_estado_buses.module';
import { TdEstadoUbicacionesModule } from './td_estado_ubicaciones/td_estado_ubicaciones.module';
import { TdNivelaccesosModule } from './td_nivelaccesos/td_nivelaccesos.module';

@Module({
  imports: [UsersModule, BusesModule, CooperativasModule, PersonasModule, ConductoresModule, TelefonosModule, EncargadoscooperativasModule, EmpleadosMtiModule, PasajerosModule, RutasModule, CooperativasRutasModule, BahiasModule, RutasBahiasModule, AlertasModule, TdAlertasModule, TdEstadoBusesModule, TdEstadoUbicacionesModule, TdNivelaccesosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
