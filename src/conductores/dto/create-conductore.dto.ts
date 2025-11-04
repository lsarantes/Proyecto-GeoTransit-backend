import * as validator from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Bus } from 'src/buses/entities/bus.entity';

export class CreateConductoreDto {
    @ApiProperty({ required: true, example: 'C0001' })
    @validator.IsString()
    id: string;

    @ApiProperty({ required: false })
    buses_asignados: Bus[];

    @ApiProperty({ required: true, example: 'P0001' })
    @validator.IsString()
    persona_id: string;
}
