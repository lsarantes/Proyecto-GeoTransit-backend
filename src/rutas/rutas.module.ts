import { Module } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RutasController],
  providers: [RutasService],
  imports: [PrismaModule],
})
export class RutasModule {}
