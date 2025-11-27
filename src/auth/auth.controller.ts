import { Controller,Get, Post, Body, HttpStatus, HttpException, UseGuards, Request, HttpCode, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('login')
  async login(
    @Body() data: CreateAuthDto
  ) {
    const usertoken = await this.authService.validateUser(data);

    if (!usertoken) throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);

    return usertoken;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Request() req) {
    const userId = req.user?.userId;
    if (!userId) {
      console.error("Error: No se pudo obtener el ID del usuario del token");
      return;
    }
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user viene del JwtStrategy (payload decodificado)
    // Asegúrate de que tu JWT payload tenga 'sub' o 'id' mapeado correctamente
    const userId = req.user.userId || req.user.sub || req.user.id; 
    return this.authService.getProfile(+userId); // El + asegura que sea número
  }

  // PATCH: /auth/profile
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto) {
    const userId = req.user.userId || req.user.sub || req.user.id;
    return this.authService.updateProfile(+userId, updateDto);
  }
}
