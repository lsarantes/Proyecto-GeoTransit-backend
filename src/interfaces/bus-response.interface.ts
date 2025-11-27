import { TD_Estado_Bus, TD_Estado_Ubicacion } from '@prisma/client';

export interface BusResponse {
    placa: string;
    modelo: string;
    capacidad: number;
    velocidad: number;
    
    ubicacion: {
        lat: number;
        lng: number;
        ultimaActualizacion: Date;
        estado: TD_Estado_Ubicacion;
    };

    estadoOperativo: TD_Estado_Bus;

    conductor: {
        id: string;
        nombreCompleto: string;
    } | null;
}