import { EstadoSolicitud } from './EstadoSolicitud';

export interface SolicitudAyuda {
    id_solicitud?: number;
    id_beneficiario?: number;
    id_empresa_receptora?: number;
    descripcion_necesidad: string;
    estado_solicitud: EstadoSolicitud;
    fecha_solicitud: Date | string;
}