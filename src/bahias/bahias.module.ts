import { Module } from '@nestjs/common';
import { BahiasService } from './bahias.service';
import { BahiasController } from './bahias.controller';

@Module({
  controllers: [BahiasController],
  providers: [BahiasService],
})
export class BahiasModule {}
