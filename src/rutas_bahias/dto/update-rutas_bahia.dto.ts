import { PartialType } from '@nestjs/swagger';
import { CreateRutasBahiaDto } from './create-rutas_bahia.dto';

export class UpdateRutasBahiaDto extends PartialType(CreateRutasBahiaDto) {}
