import { Injectable } from '@nestjs/common';
import { CreateCooperativasRutaDto } from './dto/create-cooperativas_ruta.dto';
import { UpdateCooperativasRutaDto } from './dto/update-cooperativas_ruta.dto';

@Injectable()
export class CooperativasRutasService {
  create(createCooperativasRutaDto: CreateCooperativasRutaDto) {
    return 'This action adds a new cooperativasRuta';
  }

  findAll() {
    return `This action returns all cooperativasRutas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cooperativasRuta`;
  }

  update(id: number, updateCooperativasRutaDto: UpdateCooperativasRutaDto) {
    return `This action updates a #${id} cooperativasRuta`;
  }

  remove(id: number) {
    return `This action removes a #${id} cooperativasRuta`;
  }
}
