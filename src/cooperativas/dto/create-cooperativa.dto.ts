import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateCooperativaDto {
  @IsString()
  @IsNotEmpty()
  codigoCoop: string; // El ID manual (PK)

  @IsString()
  @IsNotEmpty()
  nombre_cooperativa: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsOptional()
  cod_pais: string;

  @IsNumber()
  latitud_ubicacion: number;

  @IsNumber()
  logitud_ubicacion: number;

  @IsNumber()
  no_telefonico: number;

  @IsString()
  @IsOptional()
  url_foto_perfil: string;

  @IsDateString()
  fecha_de_creacion: string; // Recibimos fecha ISO

  // RELACIONES
  @IsString()
  @IsNotEmpty()
  id_encargado: string; // ID del Encargado_Cooperativa

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  rutasIds: string[]; // Array de IDs de las rutas (nombre_ruta) para vincular
}

// Para actualizar, extendemos usando PartialType (instala @nestjs/mapped-types si no lo tienes)
import { PartialType } from '@nestjs/mapped-types';
export class UpdateCooperativaDto extends PartialType(CreateCooperativaDto) {}