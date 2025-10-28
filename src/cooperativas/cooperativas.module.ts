import { Module } from '@nestjs/common';
import { CooperativasService } from './cooperativas.service';
import { CooperativasController } from './cooperativas.controller';

@Module({
  controllers: [CooperativasController],
  providers: [CooperativasService],
})
export class CooperativasModule {}
