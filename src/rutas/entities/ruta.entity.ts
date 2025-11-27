import { TD_Alerta } from "@prisma/client";



export class Ruta {
    nombre_ruta: string; 
    origen_latitud: number;
    origen_longitud: number;
    destino_latitud: number;
    destino_longitud: number;
    fecha_creacion: Date;
    cooperativa: CooperativasRuta[];
    bahias: RutasBahia[];
    alertas: Alerta[];
}

export class Alerta {
    id_alerta: string; 
    tipo_alerta: TD_Alerta; 
    ruta_id: string;
}

export class RutasBahia {
    ruta_id: string; 
    bahia_id: string;
}
export class CooperativasRuta {
    cooperativa_id: string; 
    ruta_id: string;
}