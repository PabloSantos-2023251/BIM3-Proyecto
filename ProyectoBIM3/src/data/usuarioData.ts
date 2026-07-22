import { readFile, writeFile } from 'fs/promises';
import { Usuario } from '../models/Usuario.js';

const FILE_PATH = './src/data/usuarios.json';

export async function leerUsuarios(): Promise<Usuario[]> {
    try {
        return JSON.parse(await readFile(FILE_PATH, 'utf-8'));
    } catch {
        return [];
    }
}

export async function guardarUsuarios(usuarios: Usuario[]): Promise<void> {
    await writeFile(FILE_PATH, JSON.stringify(usuarios, null, 2.00));
}