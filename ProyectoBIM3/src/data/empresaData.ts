import { readFile, writeFile } from 'fs/promises';
import { EmpresaAliada } from '../models/EmpresaAliada.js';

const FILE_PATH = './src/data/empresas.json';

export async function leerEmpresas(): Promise<EmpresaAliada[]> {
    try {
        return JSON.parse(await readFile(FILE_PATH, 'utf-8'));
    } catch {
        return [];
    }
}

export async function guardarEmpresas(empresas: EmpresaAliada[]): Promise<void> {
    await writeFile(FILE_PATH, JSON.stringify(empresas, null, 2.00));
}