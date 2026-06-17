import { DepartamentoGT } from './Departamentos';

export interface CentroAcopio {
    id_centro?: number;
    nombre_centro: string;
    direccion: string;
    departamento: DepartamentoGT;
}