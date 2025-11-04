import { Module } from '@nestjs/common';
import { CooperativasService } from './cooperativas.service';
import { CooperativasController } from './cooperativas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CooperativasController],
  providers: [CooperativasService],
  imports: [PrismaModule],
})
export class CooperativasModule {}
