import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ required: true, example: 'usuario123' })
    @validator.IsString()
    username: string;

    @ApiProperty({ required: true, example: 'usuario@gmail.com' })
    @validator.IsEmail()
    email: string;

    @ApiProperty({ required: true, example: 'securePassword!23' })
    @validator.IsString()
    password: string;

    @ApiProperty({ required: true, example: '2024-01-01T12:00:00Z' })
    @validator.IsDate()
    f_ultimo_acceso: Date;

    @ApiProperty({ required: true, example: true })
    @validator.IsBoolean()
    esta_activo: boolean;

    @ApiProperty({ required: true, example: 'P0023' })
    @validator.IsString()
    persona_id: string;
}
