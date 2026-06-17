import { DepartamentoGT } from './Departamentos';

export interface Beneficiario {
    id_beneficiario?: number;
    cui_dpi: string;
    nombre_completo: string;
    direccion_comunidad: string;
    departamento: DepartamentoGT;
    cantidad_dependientes?: number;
}