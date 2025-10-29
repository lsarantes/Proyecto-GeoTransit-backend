import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateTelefonoDto {
    @ApiProperty({ required: true, example: '+50512345678' })
    @validator.IsString()
    no_telefonico: string;

    @ApiProperty({ required: true, example: 'Claro' })
    @validator.IsString()
    compania: string;

    @ApiProperty({ required: true, example: 'P0023' })
    @validator.IsString()
    persona_id: string;
}
