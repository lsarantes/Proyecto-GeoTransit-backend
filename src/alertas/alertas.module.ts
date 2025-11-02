import { Module } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { AlertasController } from './alertas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AlertasController],
  providers: [AlertasService],
  imports: [PrismaModule],
})
export class AlertasModule {}