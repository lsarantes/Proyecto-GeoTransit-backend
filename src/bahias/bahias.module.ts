import { Module } from '@nestjs/common';
import { BahiasService } from './bahias.service';
import { BahiasController } from './bahias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BahiasController],
  providers: [BahiasService],
  imports: [PrismaModule],
})
export class BahiasModule {}
