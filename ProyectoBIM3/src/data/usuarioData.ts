import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { Usuario } from '../models/Usuario';

const PATH = './data_json/usuarios.json';

async function asegurarCarpeta(): Promise<void> {
    try { await mkdir(dirname(PATH), { recursive: true }); } catch {}
}

export async function leerUsuarios(): Promise<Usuario[]> {
    await asegurarCarpeta();
    try {
        const data = await readFile(PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') return [];
        throw new Error(`Error al leer usuarios: ${error.message}`);
    }
}

export async function guardarUsuarios(lista: Usuario[]): Promise<void> {
    await asegurarCarpeta();
    try {
        await writeFile(PATH, JSON.stringify(lista, null, 2));
    } catch (error: any) {
        throw new Error(`Error al escribir usuarios: ${error.message}`);
    }
}