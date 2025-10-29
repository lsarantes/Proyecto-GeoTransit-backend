import { Bahia } from "src/bahias/entities/bahia.entity";

export class EmpleadosMti {
    id_empleado_mti: string; 
    nivel_acceso: TD_NivelAcceso; 
    persona_id: string;
    bahias: Bahia[];
}
