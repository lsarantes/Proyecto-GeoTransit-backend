import { Module } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { ConductoresController } from './conductores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ConductoresController],
  providers: [ConductoresService],
  imports: [PrismaModule],
})
export class ConductoresModule {}
