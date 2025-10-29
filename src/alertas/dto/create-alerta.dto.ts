import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { TD_Alerta } from '@prisma/client';

export class CreateAlertaDto {
    @ApiProperty({ required: true, example: 'A0005' })
    @validator.IsString()
    id_alerta: string;

    @ApiProperty({ required: true, example: 'Alerta de tráfico' })
    tipo_alerta: TD_Alerta;

    @ApiProperty({ required: true, example: 'R0105' })
    @validator.IsString()
    ruta_id: string;
}
