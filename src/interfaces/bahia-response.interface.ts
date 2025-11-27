export interface BahiaResponse {
    id: string;
    nombre: string;
    ubicacion: {
        lat: number;
        lng: number;
    };
    fotoUrl: string | null;
    fechaCreacion: Date;

    // Creador
    creadoPor: {
        id: string;
        nombre: string;
    } | null;

    // Rutas asociadas
    rutas: {
        id: string;
        nombre: string;
    }[];
}