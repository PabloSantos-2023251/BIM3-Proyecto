import { NivelVulnerabilidad } from './NivelVulnerabilidad';

export interface EstudioSocioeconomico {
    id_estudio?: number;
    id_beneficiario: number;
    id_trabajador: number;
    ingreso_mensual_estimado: number;
    nivel_vulnerabilidad: NivelVulnerabilidad;
    fecha_evaluacion: Date | string;
}