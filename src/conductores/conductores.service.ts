import { Injectable } from '@nestjs/common';
import { CreateConductoreDto } from './dto/create-conductore.dto';
import { UpdateConductoreDto } from './dto/update-conductore.dto';

@Injectable()
export class ConductoresService {
  create(createConductoreDto: CreateConductoreDto) {
    return 'This action adds a new conductore';
  }

  findAll() {
    return `This action returns all conductores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conductore`;
  }

  update(id: number, updateConductoreDto: UpdateConductoreDto) {
    return `This action updates a #${id} conductore`;
  }

  remove(id: number) {
    return `This action removes a #${id} conductore`;
  }
}
