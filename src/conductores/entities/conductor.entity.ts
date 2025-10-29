import { Bus } from "src/buses/entities/bus.entity";

export class Conductor {
    id: string; 
    persona_id: string;
    buses_asignados: Bus[];
}
