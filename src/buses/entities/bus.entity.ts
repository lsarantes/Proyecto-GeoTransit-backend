export class Bus {
  email: string;
  placa: string;
  modelo: string;
  velocidad: Number;
  capacidad_de_pasajeros: number;
  latitud_actual: Number;
  longitud_actual: Number;
  fecha_hora_ultima_ubicacion: Date;
  estado_ubicacion: TD_Estado_Ubicacion;
  estado_bus: TD_Estado_Bus;
  conductor_id: string;
}
