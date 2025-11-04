import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateRutasBahiaDto {
    @ApiProperty({ required: true, example: 'R0105' })
    @validator.IsString()
    ruta_id: string;

    @ApiProperty({ required: true, example: 'Metrocentro' })
    @validator.IsString()
    bahia_id: string;
}
