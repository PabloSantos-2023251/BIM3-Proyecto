import { readFile, writeFile } from 'fs/promises';
import { Beneficiario } from '../models/Beneficiario.js';

const FILE_PATH = './src/data/beneficiarios.json';

export async function leerBeneficiarios(): Promise<Beneficiario[]> {
    try {
        return JSON.parse(await readFile(FILE_PATH, 'utf-8'));
    } catch {
        return [];
    }
}

export async function guardarBeneficiarios(beneficiarios: Beneficiario[]): Promise<void> {
    await writeFile(FILE_PATH, JSON.stringify(beneficiarios, null, 2.00));
}