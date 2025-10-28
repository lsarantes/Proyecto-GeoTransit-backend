import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateBusDto {
    @ApiProperty({ required: true, example: 'GR1826' })
    placa: string;

    @ApiProperty({ required: true, example: 'Mercedez' })
    @validator.IsString()
    modelo: string;

    @ApiProperty({ required: true, example: 120 })
    @validator.IsNumber()
    velocidad: Number;

    @ApiProperty({ required: true, example: 62 })
    @validator.IsInt()
    capacidad_de_pasajeros: number;

    @ApiProperty({ required: true })
    @validator.IsNumber()
    latitud_actual: Number;

    @ApiProperty({ required: true })
    longitud_actual: Number;

    @ApiProperty({ required: true, example: 'YYYY-MM-DD HH:SS' })
    @validator.IsDate()
    fecha_hora_ultima_ubicacion: Date;

    //@ApiProperty({ required: true, example: 'disponible' })
    //estado_ubicacion: TD_Estado_Ubicacion;

    //@ApiProperty({ required: true, example: 'activo' })
    //estado_bus: TD_Estado_Bus;

    @ApiProperty({ required: true, example: 'C0001' })
    @validator.IsString()
    conductor_id: string;
}
