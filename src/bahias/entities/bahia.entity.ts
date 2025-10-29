import { Pasajero } from 'src/pasajeros/entities/pasajero.entity';
import { RutasBahia } from 'src/rutas_bahias/entities/rutas_bahia.entity';

export class Bahia {
  nombre_bahia: String;
  ubicacion_latitud: number;
  ubicacion_longitud: number;
  url_foto: String;
  fecha_creada: Date;
  rutas: RutasBahia[];
  empleado_mti_id: String;
  pasajeros: Pasajero[];
}
