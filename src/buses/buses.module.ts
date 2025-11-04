import { Module } from '@nestjs/common';
import { BusesService } from './buses.service';
import { BusesController } from './buses.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BusesController],
  providers: [BusesService],
  imports: [PrismaModule],
})
export class BusesModule {}
