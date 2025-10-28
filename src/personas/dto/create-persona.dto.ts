import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Telefono } from 'src/telefonos/entities/telefono.entity';
import { Conductor } from 'src/conductores/entities/conductor.entity';
import { Encargado_Cooperativa } from 'src/encargadoscooperativas/entities/Encargado_Cooperativa.entity';

export class CreatePersonaDto {
    @ApiProperty({ required: true, example: 'P0013' })
    @validator.IsString()
    id: string

    @ApiProperty({ required: true, example: 'Juan' })
    @validator.IsString()
    primer_nombre: string;

    @ApiProperty({ required: false, example: 'Carlos' })
    @validator.IsString()
    segundo_nombre?: string;

    @ApiProperty({ required: false, example: 'Luis' })
    @validator.IsString()
    tercer_nombre?: string;

    @ApiProperty({ required: true, example: 'Perez' })
    @validator.IsString()
    primer_apellido: string;

    @ApiProperty({ required: false, example: 'Gomez' })
    @validator.IsString()
    segundo_apellido?: string

    @ApiProperty({ required: false, example: '505' })
    @validator.IsString()
    cod_pais?: string;

    @ApiProperty({ required: false })
    @validator.IsString()
    url_Foto?: string;

    @ApiProperty({ required: false, example: '1985-06-15' })
    @validator.IsDate()
    fecha_de_creacion: Date;

    @ApiProperty({ required: false, example: '2024-01-20' })
    @validator.IsDate()
    fecha_actualizada: Date;
    
    //@ApiProperty({ required: false, example: 'PASAJERO' })
    //role: Role;
    
    @ApiProperty({ required: true })
    telefonos: Telefono[];
    
    @ApiProperty({ required: false})
    user?: User;

    @ApiProperty({ required: false})
    conductor?: Conductor;

    @ApiProperty({ required: false})
    encargado_cooperativa?: Encargado_Cooperativa;
}
