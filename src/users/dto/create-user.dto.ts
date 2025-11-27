import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { TD_NivelAcceso } from '@prisma/client';

export class CreateEmpleadoMtiDto {
  @IsString()
  id: string; // El ID manual (ej: MTI-ADM-001)

  @IsString()
  primer_nombre: string;

  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsOptional()
  tercer_nombre?: string;

  @IsString()
  primer_apellido: string;

  @IsString()
  @IsOptional()
  segundo_apellido?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  url_Foto?: string;

  @IsEnum(TD_NivelAcceso)
  nivel_acceso: TD_NivelAcceso;
}