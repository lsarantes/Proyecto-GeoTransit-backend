import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Cooperativa } from 'src/cooperativas/entities/cooperativa.entity';

export class CreateEncargadoscooperativaDto {   
    @ApiProperty({ required: true, example: 'EC001' })
    @validator.IsString()
    id: String;

    @ApiProperty({ required: true, example: 'P0024' })
    @validator.IsString()
    persona_id: string;

    //@ApiProperty({ required: true })
    //ruta_asignada cambiar por identities de rutas y es un arreglo

    @ApiProperty({ required: true})
    cooperativas: Cooperativa[];  
}
