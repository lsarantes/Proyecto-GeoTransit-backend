import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { RutasBahia } from 'src/rutas_bahias/entities/rutas_bahia.entity';
import { EmpleadosMti } from 'src/empleados-mti/entities/empleados-mti.entity';
import { Pasajero } from 'src/pasajeros/entities/pasajero.entity';

export class CreateBahiaDto {
    @ApiProperty({ required: true, example: 'Metrocentro' })
    @validator.IsString()
    nombre_bahia: string;

    @ApiProperty({ required: true, example: 12.1234 })
    @validator.IsNumber()
    ubicacion_latitud: number;

    @ApiProperty({ required: true, example: -86.5678 })
    @validator.IsNumber()
    ubicacion_longitud: number;

    @ApiProperty({ required: true, example: 'http://link.com/bahia_m.jpg' })
    @validator.IsUrl()
    url_foto: string;

    @ApiProperty({ required: true, type: 'string', format: 'date-time' })
    @validator.IsDateString()
    fecha_creada: Date;

    @ApiProperty({ required: true, example: 'EMTI0001' })
    @validator.IsString()
    empleado_mti_id: string;

    @ApiProperty({ required: false, type: () => EmpleadosMti })
    rutas: RutasBahia[];

    @ApiProperty({ required: false, type: () => Pasajero })
    pasajeros: Pasajero[];
}
