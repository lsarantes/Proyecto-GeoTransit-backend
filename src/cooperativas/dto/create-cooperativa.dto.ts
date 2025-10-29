import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { CooperativasRuta } from 'src/cooperativas_rutas/entities/cooperativas_ruta.entity';

export class CreateCooperativaDto {
    @ApiProperty({ required: true, example: 'Cooperativa Los Pinos' })
    @validator.IsString()
    nombre_cooperativa: String;

    @ApiProperty({ required: true, example: 'Calle Principal #123' })
    @validator.IsString()
    direccion: String;

    @ApiProperty({ required: true, example: '505' })
    @validator.IsString()
    cod_pais: String;

    @ApiProperty({ required: true, example: 12.34567 })
    @validator.IsNumber()
    latitud_ubicacion: number;

    @ApiProperty({ required: true, example: -76.54321 })
    @validator.IsNumber()
    logitud_ubicacion: number;

    @ApiProperty({ required: true, example: 12345678 })
    @validator.IsInt()
    no_telefonico: number;
    
    @ApiProperty({ required: true, example: 'http://example.com/foto.jpg' })
    @validator.IsString()
    url_foto_perfil: string;

    @ApiProperty({ required: true, example: '2024-06-15' })
    @validator.IsDate()
    fecha_de_creacion: Date;

    @ApiProperty({ required: true, example: 1, description: 'ID del encargado' })
    id_encargado: number;   
    
    @ApiProperty({ required: false, example: 'Ruta A' })
    ruta: CooperativasRuta[];
}
