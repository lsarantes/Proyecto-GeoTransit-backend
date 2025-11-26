import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) { }

  async validateUser(user: CreateAuthDto) {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: user.email },
          { username: user.email },
        ],
      },
    });

    if (!foundUser) return null;
    const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
    if (isPasswordValid) {
      const foundUserData = await this.prisma.persona.findUnique({
        where: {
          id: foundUser.persona_id,
        }
      });
      if (!foundUserData) {
        throw new UnauthorizedException('Error al extraer los datos del usuario');
      }
      return this.jwtService.sign({
        id: foundUser.id_usuario,
        email: foundUser.email,
        userData: foundUserData,
      });
    } else {
      throw new UnauthorizedException('Credenciales Invalidad');
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      console.error('❌ Error al generar hash:', error);
      throw new InternalServerErrorException('No se pudo procesar la contraseña');
    }
  }
}