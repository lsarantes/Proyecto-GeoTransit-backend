import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  primer_nombre?: string;

  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsOptional()
  primer_apellido?: string;

  @IsString()
  @IsOptional()
  segundo_apellido?: string;

  @IsString()
  @IsOptional()
  url_Foto?: string;
}