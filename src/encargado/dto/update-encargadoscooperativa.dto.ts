import { PartialType } from '@nestjs/swagger';
import { CreateEncargadoDto } from './create-encargadoscooperativa.dto';

export class UpdateEncargadoscooperativaDto extends PartialType(CreateEncargadoDto) {}
