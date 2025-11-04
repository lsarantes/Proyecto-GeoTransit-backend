import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Bahia } from 'src/bahias/entities/bahia.entity';
import { TD_NivelAcceso } from '@prisma/client';

export class CreateEmpleadosMtiDto {
    @ApiProperty({ required: true, example: 'EMTI0001' })
    @validator.IsString()
    id_empleado_mti: string;

    @ApiProperty({ required: true, example: 'NIVEL_1' })
    nivel_acceso: TD_NivelAcceso;

    @ApiProperty({ required: true, example: 'P0001' })
    @validator.IsString()
    persona_id: string;

    @ApiProperty({ required: false })
    bahias: Bahia[];
    
}
