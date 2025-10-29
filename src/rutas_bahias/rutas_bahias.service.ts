import { Injectable } from '@nestjs/common';
import { CreateRutasBahiaDto } from './dto/create-rutas_bahia.dto';
import { UpdateRutasBahiaDto } from './dto/update-rutas_bahia.dto';

@Injectable()
export class RutasBahiasService {
  create(createRutasBahiaDto: CreateRutasBahiaDto) {
    return 'This action adds a new rutasBahia';
  }

  findAll() {
    return `This action returns all rutasBahias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rutasBahia`;
  }

  update(id: number, updateRutasBahiaDto: UpdateRutasBahiaDto) {
    return `This action updates a #${id} rutasBahia`;
  }

  remove(id: number) {
    return `This action removes a #${id} rutasBahia`;
  }
}
