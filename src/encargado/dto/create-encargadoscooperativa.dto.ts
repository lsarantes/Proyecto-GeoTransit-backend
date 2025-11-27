import { IsString, IsNotEmpty, IsOptional, IsArray, IsEmail } from 'class-validator';

export class CreateEncargadoDto {
  // --- DATOS DE LA TABLA ENCARGADO ---
  @IsString()
  @IsNotEmpty()
  id: string; // El código del encargado (ej: ENC-001)

  // --- DATOS DE LA TABLA PERSONA ---
  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsOptional()
  tercer_nombre?: string;

  @IsString()
  @IsNotEmpty()
  primer_apellido: string;

  @IsString()
  @IsOptional()
  segundo_apellido?: string;

  @IsString()
  @IsOptional()
  cod_pais?: string;

  @IsString()
  @IsOptional()
  url_Foto?: string;

  // --- DATOS DE USUARIO (Opcional para auto-crear cuenta) ---
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // --- RELACIONES ---
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cooperativasIds?: string[]; // IDs de las cooperativas que administrará
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateEncargadoDto extends PartialType(CreateEncargadoDto) {}