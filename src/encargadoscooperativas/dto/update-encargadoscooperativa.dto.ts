import { PartialType } from '@nestjs/swagger';
import { CreateEncargadoscooperativaDto } from './create-encargadoscooperativa.dto';

export class UpdateEncargadoscooperativaDto extends PartialType(CreateEncargadoscooperativaDto) {}
