import { UsuarioRol } from './UsuarioRol';

export interface Usuario {
    id_usuario?: number;
    nombre_completo: string;
    correo_electronico: string;
    contrasena: string;
    telefono?: string;
    rol: UsuarioRol;
}