import { TipoDonacion } from './TipoDonacion';

export interface Donacion {
    id_donacion?: number;
    id_usuario?: number;
    id_empresa?: number;
    id_centro: number;
    tipo_donacion: TipoDonacion;
    fecha_donacion: Date | string;
    monto_monetario?: number;
}