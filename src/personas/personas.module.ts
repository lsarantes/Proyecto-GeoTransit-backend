import { Module } from '@nestjs/common';
import { PersonasService } from './personas.service';
import { PersonasController } from './personas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PersonasController],
  providers: [PersonasService],
  imports: [PrismaModule],
})
export class PersonasModule {}
