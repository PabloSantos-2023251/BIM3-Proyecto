import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { EmpresaAliada } from '../models/EmpresaAliada';

const PATH = './data_json/empresas.json';

async function asegurarCarpeta(): Promise<void> {
    try { await mkdir(dirname(PATH), { recursive: true }); } catch {}
}

export async function leerEmpresas(): Promise<EmpresaAliada[]> {
    await asegurarCarpeta();
    try {
        const data = await readFile(PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') return [];
        throw new Error(`Error al leer empresas: ${error.message}`);
    }
}

export async function guardarEmpresas(lista: EmpresaAliada[]): Promise<void> {
    await asegurarCarpeta();
    try {
        await writeFile(PATH, JSON.stringify(lista, null, 2));
    } catch (error: any) {
        throw new Error(`Error al escribir empresas: ${error.message}`);
    }
}