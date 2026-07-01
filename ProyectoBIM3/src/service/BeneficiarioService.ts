import { beneficiarios, idBeneficiarioCtr } from '../data/db';
import { Beneficiario } from '../models/Beneficiario';
import { DepartamentoGT } from '../models/Departamentos';

export function listarBeneficiarios(): Beneficiario[] {
    return beneficiarios;
}

export function buscarBeneficiario(id: number): Beneficiario | null {
    const b = beneficiarios.find(x => x.id_beneficiario === id);
    if (!b) {
        console.log(`El beneficiario con ID ${id} no existe.`);
        return null;
    }
    return b;
}

export function crearBeneficiario(cui: string, nombre: string, direccion: string, deptoInput: DepartamentoGT, dependientes?: number): Beneficiario {
    const nuevo: Beneficiario = {
        id_beneficiario: idBeneficiarioCtr,
        cui_dpi: cui,
        nombre_completo: nombre,
        direccion_comunidad: direccion,
        departamento: deptoInput,
        cantidad_dependientes: dependientes || 0
    };
    beneficiarios.push(nuevo);
    return nuevo;
}

export function editarBeneficiario(id: number, nuevosDatos: { nombre_completo?: string, direccion_comunidad?: string, departamento?: DepartamentoGT, cantidad_dependientes?: number }): Beneficiario | null {
    const b = beneficiarios.find(x => x.id_beneficiario === id);
    if (!b) {
        console.log(`El beneficiario con ID ${id} no existe.`);
        return null;
    }

    if (nuevosDatos.nombre_completo !== undefined) b.nombre_completo = nuevosDatos.nombre_completo;
    if (nuevosDatos.direccion_comunidad !== undefined) b.direccion_comunidad = nuevosDatos.direccion_comunidad;
    if (nuevosDatos.departamento !== undefined) b.departamento = nuevosDatos.departamento;
    if (nuevosDatos.cantidad_dependientes !== undefined) b.cantidad_dependientes = nuevosDatos.cantidad_dependientes;

    return b;
}

export function borrarBeneficiario(id: number): Beneficiario | null {
    const indice = beneficiarios.findIndex(b => b.id_beneficiario === id);
    if (indice === -1) {
        console.log(`El beneficiario con ID ${id} no existe.`);
        return null;
    }
    return beneficiarios.splice(indice, 1)[0];
}