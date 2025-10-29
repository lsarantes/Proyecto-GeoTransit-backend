import { Injectable } from '@nestjs/common';
import { CreateBahiaDto } from './dto/create-bahia.dto';
import { UpdateBahiaDto } from './dto/update-bahia.dto';

@Injectable()
export class BahiasService {
  create(createBahiaDto: CreateBahiaDto) {
    return 'This action adds a new bahia';
  }

  findAll() {
    return `This action returns all bahias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bahia`;
  }

  update(id: number, updateBahiaDto: UpdateBahiaDto) {
    return `This action updates a #${id} bahia`;
  }

  remove(id: number) {
    return `This action removes a #${id} bahia`;
  }
}
