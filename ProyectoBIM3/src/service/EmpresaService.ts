import { empresas, idEmpresaCtr } from '../data/db';
import { EmpresaAliada } from '../models/EmpresaAliada';
import { TipoRelacionEmpresa } from '../models/TipoRelacionEmpresa';

export function listarEmpresas(): EmpresaAliada[] {
    return empresas;
}

export function buscarEmpresa(id: number): EmpresaAliada | null {
    const empresa = empresas.find(e => e.id_empresa === id);
    if (!empresa) {
        console.log(`La empresa con ID ${id} no existe.`);
        return null;
    }
    return empresa;
}

export function crearEmpresa(idUsuario: number, razonSocial: string, relacionInput: string, contacto?: string): EmpresaAliada | null {
    let tipo_relacion: TipoRelacionEmpresa;
    const relUpper = relacionInput.toUpperCase().trim();

    if (relUpper === "APORTADORA" || relUpper === "DONANTE") {
        tipo_relacion = TipoRelacionEmpresa.APORTADORA;
    } else if (relUpper === "AYUDA RECEPTORA" || relUpper === "RECEPTORA" || relUpper === "BENEFICIARIA") {
        tipo_relacion = TipoRelacionEmpresa.AYUDA_RECEPTORA;
    } else if (relUpper === "LOGISTICA" || relUpper === "LOGÍSTICA") {
        tipo_relacion = TipoRelacionEmpresa.LOGISTICA;
    } else {
        console.log("Error: Tipo de relación no válido.");
        return null;
    }

    const nueva: EmpresaAliada = { id_empresa: idEmpresaCtr, id_usuario: idUsuario, razon_social: razonSocial, tipo_relacion, contacto_corporativo: contacto };
    empresas.push(nueva);
    return nueva;
}

export function borrarEmpresa(id: number): EmpresaAliada | null {
    const indice = empresas.findIndex(e => e.id_empresa === id);

    if (indice === -1) {
        console.log(`La empresa con ID ${id} no existe.`);
        return null;
    }

    const empresaBorrada = empresas[indice];
    empresas.splice(indice, 1);
    return empresaBorrada;
}

export function editarEmpresa(id: number, nuevosDatos: { razon_social?: string, relacionInput?: string, contacto_corporativo?: string }): EmpresaAliada | null {
    const empresa = empresas.find(e => e.id_empresa === id);

    if (!empresa) {
        console.log(`La empresa con ID ${id} no existe.`);
        return null;
    }

    if (nuevosDatos.relacionInput !== undefined) {
        const relUpper = nuevosDatos.relacionInput.toUpperCase().trim();
        if (relUpper === "APORTADORA" || relUpper === "DONANTE") {
            empresa.tipo_relacion = TipoRelacionEmpresa.APORTADORA;
        } else if (relUpper === "AYUDA RECEPTORA" || relUpper === "RECEPTORA") {
            empresa.tipo_relacion = TipoRelacionEmpresa.AYUDA_RECEPTORA;
        } else if (relUpper === "LOGISTICA" || relUpper === "LOGÍSTICA") {
            empresa.tipo_relacion = TipoRelacionEmpresa.LOGISTICA;
        } else {
            console.log("Error: Tipo de relación no válido.");
            return null;
        }
    }

    if (nuevosDatos.razon_social !== undefined) {
        empresa.razon_social = nuevosDatos.razon_social;
    }

    if (nuevosDatos.contacto_corporativo !== undefined) {
        empresa.contacto_corporativo = nuevosDatos.contacto_corporativo;
    }

    return empresa;
}