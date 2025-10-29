import { PartialType } from '@nestjs/swagger';
import { CreateBahiaDto } from './create-bahia.dto';

export class UpdateBahiaDto extends PartialType(CreateBahiaDto) {}
