import { usuarios, idUsuarioCtr } from '../service/db';
import { Usuario } from '../models/Usuario';
import { UsuarioRol } from '../models/UsuarioRol';

export function listarUsuarios(): Usuario[] {
    return usuarios;
}

export function buscarUsuario(id: number): Usuario | null {
    const usuario = usuarios.find(u => u.id_usuario === id);
    if (!usuario) {
        console.log(`El usuario con ID ${id} no existe.`);
        return null;
    }
    return usuario;
}

export function crearUsuario(nombre: string, correo: string, contrasena: string, rolInput: string, telefono?: string): Usuario | null {
    let rol: UsuarioRol;
    const rolUpper = rolInput.toUpperCase().trim();

    if (rolUpper === "ADMINISTRADOR" || rolUpper === "ADMIN") {
        rol = UsuarioRol.ADMINISTRADOR;
    } else if (rolUpper === "TRABAJADOR SOCIAL" || rolUpper === "TRABAJADOR_SOCIAL") {
        rol = UsuarioRol.TRABAJADOR_SOCIAL;
    } else if (rolUpper === "VOLUNTARIO") {
        rol = UsuarioRol.VOLUNTARIO;
    } else if (rolUpper === "DONANTE") {
        rol = UsuarioRol.DONANTE;
    } else {
        console.log("Error: Rol no válido.");
        return null;
    }

    const nuevo: Usuario = { id_usuario: idUsuarioCtr, nombre_completo: nombre, correo_electronico: correo, contrasena, telefono, rol };
    usuarios.push(nuevo);
    return nuevo;
}

export function editarUsuario(id: number, nuevosDatos: { nombre_completo?: string, correo_electronico?: string, contrasena?: string, telefono?: string, rolInput?: string }): Usuario | null {
    const usuario = usuarios.find(u => u.id_usuario === id);
    if (!usuario) {
        console.log(`El usuario con ID ${id} no existe.`);
        return null;
    }

    if (nuevosDatos.rolInput !== undefined) {
        const rolUpper = nuevosDatos.rolInput.toUpperCase().trim();
        if (rolUpper === "ADMINISTRADOR" || rolUpper === "ADMIN") usuario.rol = UsuarioRol.ADMINISTRADOR;
        else if (rolUpper === "TRABAJADOR SOCIAL" || rolUpper === "TRABAJADOR_SOCIAL") usuario.rol = UsuarioRol.TRABAJADOR_SOCIAL;
        else if (rolUpper === "VOLUNTARIO") usuario.rol = UsuarioRol.VOLUNTARIO;
        else if (rolUpper === "DONANTE") usuario.rol = UsuarioRol.DONANTE;
        else {
            console.log("Error: Rol no válido.");
            return null;
        }
    }

    if (nuevosDatos.nombre_completo !== undefined) usuario.nombre_completo = nuevosDatos.nombre_completo;
    if (nuevosDatos.correo_electronico !== undefined) usuario.correo_electronico = nuevosDatos.correo_electronico;
    if (nuevosDatos.contrasena !== undefined) usuario.contrasena = nuevosDatos.contrasena;
    if (nuevosDatos.telefono !== undefined) usuario.telefono = nuevosDatos.telefono;

    return usuario;
}

export function borrarUsuario(id: number): Usuario | null {
    const indice = usuarios.findIndex(u => u.id_usuario === id);
    if (indice === -1) {
        console.log(`El usuario con ID ${id} no existe.`);
        return null;
    }
    return usuarios.splice(indice, 1)[0];
}