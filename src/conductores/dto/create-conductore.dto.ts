import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateConductorDto {
  // ID del Conductor (ej: COND-456)
  @IsString()
  @IsNotEmpty()
  id: string; 

  // Datos Persona
  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @IsString()
  @IsOptional()
  segundo_nombre: string;

  @IsString()
  @IsOptional()
  tercer_nombre: string;

  @IsString()
  @IsNotEmpty()
  primer_apellido: string;

  @IsString()
  @IsOptional()
  segundo_apellido: string;

  @IsString()
  @IsOptional()
  cod_pais: string;

  @IsString()
  @IsOptional()
  url_Foto: string;

  // Opcional: Si quieres que el conductor tenga login (App Móvil de Conductor)
  @IsEmail()
  @IsOptional()
  email: string;
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateConductorDto extends PartialType(CreateConductorDto) {}