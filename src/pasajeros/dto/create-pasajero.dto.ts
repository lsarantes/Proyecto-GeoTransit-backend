import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreatePasajeroDto {
@ApiProperty({ required: true, example: 'PJ0645' })
    @validator.IsString()
    id_pasajero: string;

    @ApiProperty({ required: true, example: 'Metrocentro' })
    @validator.IsString()
    bahia_origen: string;

    @ApiProperty({ required: true, example: 'MercadoOriental' })
    @validator.IsString()
    bahia_destino: string;

    @ApiProperty({ required: true, example: 'P00987' })
    @validator.IsString()
    persona_id: string; 

    @ApiProperty({ required: true, example: 'B0283' })
    @validator.IsString()
    bahia_id: string;
}
