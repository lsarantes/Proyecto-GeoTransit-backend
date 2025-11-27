import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateEmpleadoMtiDto } from './create-user.dto';

export class UpdateEmpleadoMtiDto extends PartialType(CreateEmpleadoMtiDto) {
  @IsBoolean()
  @IsOptional()
  esta_activo?: boolean; // Para bloquear/desbloquear acceso

  @IsString()
  @IsOptional()
  password?: string; // Por si un admin necesita resetear la contraseña manualmente
}