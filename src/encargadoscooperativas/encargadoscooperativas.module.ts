import { Module } from '@nestjs/common';
import { EncargadoscooperativasService } from './encargadoscooperativas.service';
import { EncargadoscooperativasController } from './encargadoscooperativas.controller';

@Module({
  controllers: [EncargadoscooperativasController],
  providers: [EncargadoscooperativasService],
})
export class EncargadoscooperativasModule {}
