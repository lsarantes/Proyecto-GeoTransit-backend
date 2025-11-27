import { Role } from '@prisma/client';

export interface UserResponse {
    id_usuario: number; // ID numérico de la tabla User
    username: string;
    email: string;
    estaActivo: boolean;
    ultimoAcceso: Date | null;

    // Datos de Persona (Perfil)
    personaId: string;
    nombreCompleto: string;
    role: Role;
    fotoUrl: string | null;
    nivelAcceso?: string
}