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

@Module({
  imports: [UsersModule, BusesModule, CooperativasModule, PersonasModule, ConductoresModule, TelefonosModule, EncargadoscooperativasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
