import { Module } from '@nestjs/common';
import { TelefonosService } from './telefonos.service';
import { TelefonosController } from './telefonos.controller';

@Module({
  controllers: [TelefonosController],
  providers: [TelefonosService],
})
export class TelefonosModule {}
