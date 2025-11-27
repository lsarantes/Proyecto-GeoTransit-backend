export interface CooperativaResponse {
    codigoCoop: string;
    nombre_cooperativa: string;
    direccion: string;
    ubicacion: { // Agrupamos lat/lng para limpieza
        lat: number;
        lng: number;
    };
    contacto: {
        telefono: number;
        pais: string | null;
    };
    fotoUrl: string | null;
    fechaCreacion: Date;
    
    // Datos procesados del Encargado
    encargado: {
        id: string;
        nombreCompleto: string; // Fusionamos nombre y apellido aquí
        fotoUrl: string | null;
    };

    // Lista simplificada de rutas
    rutas: {
        id: string; // nombre_ruta
        nombre: string;
    }[];
}