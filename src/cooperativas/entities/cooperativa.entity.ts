import { CooperativasRuta } from "src/cooperativas_rutas/entities/cooperativas_ruta.entity";

export class Cooperativa {
    nombre_cooperativa: string; 
    direccion: string;
    cod_pais: string;
    latitud_ubicacion: number;
    logitud_ubicacion: number;
    no_telefonico: number;
    url_foto_perfil: string;
    fecha_de_creacion: Date;
    id_encargado: string;
    ruta: CooperativasRuta[];
}
