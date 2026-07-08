import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { Beneficiario } from '../models/Beneficiario';

const PATH = './data_json/beneficiarios.json';

async function asegurarCarpeta(): Promise<void> {
    try { await mkdir(dirname(PATH), { recursive: true }); } catch {}
}

export async function leerBeneficiarios(): Promise<Beneficiario[]> {
    await asegurarCarpeta();
    try {
        const data = await readFile(PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') return [];
        throw new Error(`Error al leer beneficiarios: ${error.message}`);
    }
}

export async function guardarBeneficiarios(lista: Beneficiario[]): Promise<void> {
    await asegurarCarpeta();
    try {
        await writeFile(PATH, JSON.stringify(lista, null, 2));
    } catch (error: any) {
        throw new Error(`Error al escribir beneficiarios: ${error.message}`);
    }
}