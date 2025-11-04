import { Injectable } from '@nestjs/common';
import { CreateEncargadoscooperativaDto } from './dto/create-encargadoscooperativa.dto';
import { UpdateEncargadoscooperativaDto } from './dto/update-encargadoscooperativa.dto';

@Injectable()
export class EncargadoscooperativasService {
  create(createEncargadoscooperativaDto: CreateEncargadoscooperativaDto) {
    return 'This action adds a new encargadoscooperativa';
  }

  findAll() {
    return `This action returns all encargadoscooperativas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} encargadoscooperativa`;
  }

  update(id: number, updateEncargadoscooperativaDto: UpdateEncargadoscooperativaDto) {
    return `This action updates a #${id} encargadoscooperativa`;
  }

  remove(id: number) {
    return `This action removes a #${id} encargadoscooperativa`;
  }
}
