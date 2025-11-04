import { PartialType } from '@nestjs/swagger';
import { CreateCooperativasRutaDto } from './create-cooperativas_ruta.dto';

export class UpdateCooperativasRutaDto extends PartialType(CreateCooperativasRutaDto) {}
