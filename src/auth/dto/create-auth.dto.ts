import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
        @ApiProperty({required: true})
        email:string;

        @ApiProperty({required:true})
        password: string;
}
