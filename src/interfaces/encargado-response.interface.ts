export interface EncargadoResponse {
    id: string; // ID de Encargado (ENC-001)
    personaId: string; // UUID de Persona
    
    // Datos aplanados de Persona
    nombreCompleto: string;
    nombres: string;
    apellidos: string;
    email: string; // Del usuario asociado
    fotoUrl: string | null;
    fechaRegistro: Date;

    // Relaciones
    cooperativas: {
        id: string;
        nombre: string;
    }[];
}