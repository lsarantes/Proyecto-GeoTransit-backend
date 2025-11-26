import { Controller,  Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    @Post('login')
    async login(
        @Body() data:CreateAuthDto
    ){
        const usertoken =  await this.authService.validateUser(data);

        if(!usertoken) throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);
    
        return usertoken;
    }
}
