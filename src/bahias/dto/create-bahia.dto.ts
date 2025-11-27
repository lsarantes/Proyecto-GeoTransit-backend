import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateBahiaDto {
  @IsString()
  @IsNotEmpty()
  id: string; // Código de la bahía (ej: "BAH-001")

  @IsString()
  @IsNotEmpty()
  nombre_bahia: string;

  @IsNumber()
  ubicacion_latitud: number;

  @IsNumber()
  ubicacion_longitud: number;

  @IsString()
  @IsOptional()
  url_foto: string;

  @IsDateString()
  fecha_creada: string;

  // Relación 1:N (Creador)
  @IsString()
  @IsNotEmpty()
  empleado_mti_id: string; // ID del empleado que la registra

  // Relación N:N (Rutas que pasan por aquí)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  rutasIds?: string[]; 
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateBahiaDto extends PartialType(CreateBahiaDto) {}