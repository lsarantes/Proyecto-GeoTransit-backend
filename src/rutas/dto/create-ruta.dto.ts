import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateRutaDto {
  @IsString()
  @IsNotEmpty()
  id: string; // PK Manual (Ej: "104", "110", "MR-01")

  @IsString()
  @IsNotEmpty()
  nombre_ruta: string; // Nombre descriptivo "Ruta 104 - UCA"

  @IsNumber()
  origen_latitud: number;

  @IsNumber()
  origen_longitud: number;

  @IsNumber()
  destino_latitud: number;

  @IsNumber()
  destino_longitud: number;

  @IsDateString()
  fecha_creacion: string;

  // --- RELACIONES N:N ---
  
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cooperativasIds?: string[]; // IDs de las cooperativas

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bahiasIds?: string[]; // IDs de las bahías
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateRutaDto extends PartialType(CreateRutaDto) {}