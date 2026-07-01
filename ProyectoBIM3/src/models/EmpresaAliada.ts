import { TipoRelacionEmpresa } from './TipoRelacionEmpresa';

export interface EmpresaAliada {
    id_empresa?: number;
    id_usuario: number;
    razon_social: string;
    tipo_relacion: TipoRelacionEmpresa;
    contacto_corporativo?: string;
}