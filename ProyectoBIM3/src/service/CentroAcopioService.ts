import { centros, idCentroCtr } from '../data/db';
import { CentroAcopio } from '../models/CentroAcopio';
import { DepartamentoGT } from '../models/Departamentos';

export function listarCentros(): CentroAcopio[] {
    return centros;
}

export function buscarCentro(id: number): CentroAcopio | null {
    const centro = centros.find(c => c.id_centro === id);
    if (!centro) {
        console.log(`El centro con ID ${id} no existe.`);
        return null;
    }
    return centro;
}

export function crearCentro(nombre: string, direccion: string, deptoInput: DepartamentoGT): CentroAcopio {
    const nuevo: CentroAcopio = { id_centro: idCentroCtr, nombre_centro: nombre, direccion, departamento: deptoInput };
    centros.push(nuevo);
    return nuevo;
}

export function editarCentro(id: number, nuevosDatos: { nombre_centro?: string, direccion?: string, departamento?: DepartamentoGT }): CentroAcopio | null {
    const centro = centros.find(c => c.id_centro === id);
    if (!centro) {
        console.log(`El centro con ID ${id} no existe.`);
        return null;
    }

    if (nuevosDatos.nombre_centro !== undefined) centro.nombre_centro = nuevosDatos.nombre_centro;
    if (nuevosDatos.direccion !== undefined) centro.direccion = nuevosDatos.direccion;
    if (nuevosDatos.departamento !== undefined) centro.departamento = nuevosDatos.departamento;

    return centro;
}

export function borrarCentro(id: number): CentroAcopio | null {
    const indice = centros.findIndex(c => c.id_centro === id);
    if (indice === -1) {
        console.log(`El centro con ID ${id} no existe.`);
        return null;
    }
    return centros.splice(indice, 1)[0];
}