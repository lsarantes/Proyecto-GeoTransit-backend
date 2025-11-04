import * as validator from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CooperativasRuta } from 'src/cooperativas_rutas/entities/cooperativas_ruta.entity';
import { RutasBahia } from 'src/rutas_bahias/entities/rutas_bahia.entity';
import { Alerta } from 'src/alertas/entities/alerta.entity';

export class CreateRutaDto {
  @ApiProperty({ required: true, example: '117' })
  @validator.IsString()
  nombre_ruta: string;

  @ApiProperty({ required: true, example: 12.115 })
  @validator.IsNumber()
  origen_latitud: number;

  @ApiProperty({ required: true, example: -86.237 })
  @validator.IsNumber()
  origen_longitud: number;

  @ApiProperty({ required: true, example: 12.09 })
  @validator.IsNumber()
  destino_latitud: number;

  @ApiProperty({ required: true, example: -86.27 })
  @validator.IsNumber()
  destino_longitud: number;

  @ApiProperty({ required: true, type: 'string', format: 'date-time' })
  @validator.IsDateString()
  fecha_creacion: Date;

  @ApiProperty({ required: false })
  cooperativa: CooperativasRuta[];

  @ApiProperty({ required: false })
  bahias: RutasBahia[];

  @ApiProperty({ required: false })
  alertas: Alerta[];
}
