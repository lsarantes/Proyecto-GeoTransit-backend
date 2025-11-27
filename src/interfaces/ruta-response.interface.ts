export interface RutaResponse {
    id: string;
    nombre: string;
    origen: {
        lat: number;
        lng: number;
    };
    destino: {
        lat: number;
        lng: number;
    };
    fechaCreacion: Date;

    // Relaciones simplificadas para el frontend
    cooperativas: {
        id: string;
        nombre: string;
    }[];
    
    bahias: {
        id: string;
        nombre: string;
    }[];
}