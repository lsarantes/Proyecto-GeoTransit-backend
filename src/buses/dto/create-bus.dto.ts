import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { TD_Estado_Bus, TD_Estado_Ubicacion } from '@prisma/client'; // Importamos Enums de Prisma

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  placa: string; // PK (Ej: "M 123-456")

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsNumber()
  velocidad: number;

  @IsNumber()
  capacidad_de_pasajeros: number;

  // Ubicación inicial
  @IsNumber()
  latitud_actual: number;

  @IsNumber()
  longitud_actual: number;

  @IsDateString()
  fecha_hora_ultima_ubicacion: string;

  // Enums
  @IsEnum(TD_Estado_Ubicacion)
  estado_ubicacion: TD_Estado_Ubicacion;

  @IsEnum(TD_Estado_Bus)
  estado_bus: TD_Estado_Bus;

  // Relación
  @IsString()
  @IsNotEmpty()
  conductor_id: string; // ID del Conductor
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateBusDto extends PartialType(CreateBusDto) {}