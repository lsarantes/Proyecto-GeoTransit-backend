import { Module } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { ConductoresController } from './conductores.controller';

@Module({
  controllers: [ConductoresController],
  providers: [ConductoresService],
})
export class ConductoresModule {}
