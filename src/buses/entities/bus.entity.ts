import { TD_Estado_Ubicacion,TD_Estado_Bus } from "@prisma/client";

export class Bus {
  email: string;
  placa: string;
  modelo: string;
  velocidad: number;
  capacidad_de_pasajeros: number;
  latitud_actual: number;
  longitud_actual: number;
  fecha_hora_ultima_ubicacion: Date;
  estado_ubicacion: TD_Estado_Ubicacion;
  estado_bus: TD_Estado_Bus;
  conductor_id: string;
}
