import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { UpdateProfileDto } from './dto/update-profile.dto';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }



async validateUser(user: CreateAuthDto) {
        // --- 1. VALIDACIÓN INICIAL DE USUARIO Y CONTRASEÑA (Sin Cambios) ---
        const foundUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: user.email },
                    { username: user.email },
                ],
            },
            include: { persona: true }, // Incluir persona para el chequeo de rol
        });

        if (!foundUser) return null;

        const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales Inválidas');
        }

        // --- 2. CHEQUEO DE ESTADO Y PERMISOS ---
        if (foundUser.esta_activo) {
            throw new UnauthorizedException('Existe otra sesión activa');
        }

        const empleado = await this.prisma.empleado_MTI.findFirst({
            where: {
                AND: [
                    { persona_id: foundUser.persona_id },
                    { NOT: { nivel_acceso: "Gestor_de_cooperativas_y_encargados" } },
                ],
            }
        });

        if (!empleado) {
            throw new UnauthorizedException('El Usuario no tiene permiso en este sistema');
        }

        // --- 3. ACTUALIZACIÓN DE ESTADO Y GENERACIÓN DE SESIÓN ---

        // A. Actualizar estado `esta_activo`
        await this.prisma.user.update({
            where: { id_usuario: foundUser.id_usuario },
            data: { esta_activo: true }
        });

        // B. Crear el payload JWT (usa solo datos esenciales)
        const payload = {
            sub: foundUser.id_usuario, // Estándar JWT
            email: foundUser.email,
            role: empleado.nivel_acceso,
        };

        // C. GENERAR RESPUESTA USANDO EL MÉTODO getProfile (¡DRY!)
        
        // El método getProfile ya se encarga de:
        // 1. Buscar al usuario y todos sus datos (Persona, Empleado_MTI, etc.)
        // 2. Mapear todo a la estructura final que espera el Frontend.
        const dataUser = await this.getProfile(foundUser.id_usuario);
        
        // Sobreescribimos solo las claves que necesitamos de la respuesta final
        return {
            token: this.jwtService.sign(payload),
            user: dataUser // Retornamos el objeto completo formateado por getProfile
        };
    }

  
  async logout(userId: number) {
    try {
      await this.prisma.user.update({
        where: { id_usuario: userId },
        data: { esta_activo: false }
      });
      return { message: 'Sesión cerrada correctamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error al cerrar sesión en base de datos');
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

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id_usuario: userId },
      include: {
        persona: {
          include: {
            empleado_mti: true,      // Incluir datos si es empleado MTI
            encargado_cooperativa: true, // Incluir si es encargado
            telefonos: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Mapeamos la respuesta para que sea fácil de leer en el Frontend
    return this.mapProfileResponse(user);
  }

  // ✅ 2. ACTUALIZAR PERFIL
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    // Primero obtenemos el ID de la persona asociada al usuario
    const user = await this.prisma.user.findUnique({
      where: { id_usuario: userId },
      select: { persona_id: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Actualizamos la tabla Persona
     await this.prisma.persona.update({
      where: { id: user.persona_id },
      data: {
        primer_nombre: dto.primer_nombre,
        segundo_nombre: dto.segundo_nombre,
        primer_apellido: dto.primer_apellido,
        segundo_apellido: dto.segundo_apellido,
        url_Foto: dto.url_Foto,
      },
    });

    // Retornamos el perfil completo actualizado
    return this.getProfile(userId);
  }

  // --- MAPPER PRIVADO (Backend -> Frontend) ---
  private mapProfileResponse(user: any) {
    const p = user.persona;
    
    // Determinar nivel de acceso o rol específico
    let rolDetalle: any = null;
    if (p.empleado_mti) {
        rolDetalle = { 
            tipo: 'MTI', 
            nivel: p.empleado_mti.nivel_acceso 
        };
    } else if (p.encargado_cooperativa) {
        rolDetalle = { type: 'COOPERATIVA' };
    }

    return {
      id_usuario: user.id_usuario,
      username: user.username,
      email: user.email,
      isActive: user.esta_activo,
      lastLogin: user.f_ultimo_acceso,
      
      // Datos Personales aplanados
      persona: {
        id: p.id,
        nombres: `${p.primer_nombre} ${p.segundo_nombre || ''}`.trim(),
        apellidos: `${p.primer_apellido} ${p.segundo_apellido || ''}`.trim(),
        primer_nombre: p.primer_nombre, // Para el form de edición
        segundo_nombre: p.segundo_nombre,
        primer_apellido: p.primer_apellido,
        segundo_apellido: p.segundo_apellido,
        fotoUrl: p.url_Foto,
        telefonos: p.telefonos,
      },

      // Rol del Sistema
      role: p.role, 
      detalles_rol: rolDetalle
    };
  }
}