import { Alerta } from "src/alertas/entities/alerta.entity";
import { CooperativasRuta } from "src/cooperativas_rutas/entities/cooperativas_ruta.entity";
import { RutasBahia } from "src/rutas_bahias/entities/rutas_bahia.entity";

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
