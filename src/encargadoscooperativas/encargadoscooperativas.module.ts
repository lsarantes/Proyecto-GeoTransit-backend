import { Module } from '@nestjs/common';
import { EncargadoscooperativasService } from './encargadoscooperativas.service';
import { EncargadoscooperativasController } from './encargadoscooperativas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [EncargadoscooperativasController],
  providers: [EncargadoscooperativasService],
  imports: [PrismaModule],
})
export class EncargadoscooperativasModule {}
