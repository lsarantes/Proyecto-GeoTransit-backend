import { Cooperativa } from "src/cooperativas/entities/cooperativa.entity";

export class Encargado_Cooperativa {
    id: string; 
    persona_id: string;
    cooperativas: Cooperativa[];
}
