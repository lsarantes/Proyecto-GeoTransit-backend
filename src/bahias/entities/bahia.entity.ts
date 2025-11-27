

export class Bahia {
  nombre_bahia: string;
  ubicacion_latitud: number;
  ubicacion_longitud: number;
  url_foto: string;
  fecha_creada: Date;
  rutas: RutasBahia[];
  empleado_mti_id: string;
  pasajeros: Pasajero[];
}
export class Pasajero {
    id_pasajero: string; 
    bahia_origen: string;
    bahia_destino: string;
    persona_id: string; 
    bahia_id: string;
}
export class RutasBahia {
    ruta_id: string; 
    bahia_id: string;
}