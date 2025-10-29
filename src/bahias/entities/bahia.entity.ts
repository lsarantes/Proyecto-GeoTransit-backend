import { Pasajero } from 'src/pasajeros/entities/pasajero.entity';
import { RutasBahia } from 'src/rutas_bahias/entities/rutas_bahia.entity';

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
