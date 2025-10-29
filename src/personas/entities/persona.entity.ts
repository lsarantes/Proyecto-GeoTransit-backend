export class Persona {
    id: string; 
    primer_nombre: string;
    segundo_nombre?: string; 
    tercer_nombre?: string;
    primer_apellido: string;
    segundo_apellido?: string;
    cod_pais?: string;
    url_Foto?: string;
    fecha_de_creacion: Date;
    fecha_actualizada: Date;
    role: Role;
}
