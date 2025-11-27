export interface ConductorResponse {
    id: string; // ID Conductor (PK)
    personaId: string;
    
    // Datos aplanados
    nombreCompleto: string;
    nombres: string;
    apellidos: string;
    fotoUrl: string | null;
    
    // Datos de sistema
    email: string | null; // Si tiene usuario
    busesAsignados: number; // Cantidad de buses que maneja
}