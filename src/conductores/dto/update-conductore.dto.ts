import { PartialType } from '@nestjs/swagger';
import { CreateConductorDto } from './create-conductore.dto';

export class UpdateConductoreDto extends PartialType(CreateConductorDto) {}
