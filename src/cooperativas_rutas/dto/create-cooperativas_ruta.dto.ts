import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Ruta } from 'src/rutas/entities/ruta.entity';
import { Cooperativa } from 'src/cooperativas/entities/cooperativa.entity';

export class CreateCooperativasRutaDto {
    @ApiProperty({ required: true, example: 'C0023' })
    @validator.IsString()
    cooperativa_id: string;

    @ApiProperty({ required: true, example: 'R8105' })
    @validator.IsString()
    ruta_id: string;

    @ApiProperty({ required: false, type: () => Ruta })
    ruta: Ruta;

    @ApiProperty({ required: false, type: () => Cooperativa })
    cooperativa: Cooperativa;
}
