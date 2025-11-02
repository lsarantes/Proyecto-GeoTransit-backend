import { Injectable } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PersonasService {

  constructor(private readonly prisma: PrismaService) { }

  create(createPersonaDto: CreatePersonaDto) {
    const { telefonos, user, conductor, encargado_cooperativa, ...personaData } = createPersonaDto;
    return this.prisma.persona.create({ data: personaData});
  }

  findAll() {
    return this.prisma.persona.findMany();
  }

  findOne(id: string) {
    return this.prisma.persona.findUnique({ where: { id } });
  }

  update(id: string, updatePersonaDto: UpdatePersonaDto) {
    const { telefonos, user, conductor, encargado_cooperativa, ...personaData } = updatePersonaDto;
    return this.prisma.persona.update({ where: { id }, data: personaData });
  }

  remove(id: string) {
    return this.prisma.persona.delete({ where: { id } });
  }
}
