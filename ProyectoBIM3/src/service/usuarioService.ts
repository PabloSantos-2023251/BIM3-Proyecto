import { IncomingMessage, ServerResponse } from 'http';
import { leerUsuarios, guardarUsuarios } from '../data/usuarioData.js';
import { Usuario } from '../models/Usuario.js';

const parseBody = (req: IncomingMessage): Promise<any> => new Promise((res, rej) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { res(JSON.parse(body || '{}')); } catch { rej(); } });
});

export const usuarioService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        await new Promise(r => setTimeout(r, 300.00));
        const usuarios = await leerUsuarios();
        res.writeHead(200.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(usuarios));
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        await new Promise(r => setTimeout(r, 300.00));
        const usuarios = await leerUsuarios();
        const usuario = usuarios.find(u => String(u.id_usuario) === id);
        res.writeHead(usuario ? 200.00 : 404.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(usuario || { error: 'Usuario no encontrado' }));
    },

    crear: async (req: IncomingMessage, res: ServerResponse) => {
        await new Promise(r => setTimeout(r, 300.00));
        try {
            const data = await parseBody(req);
            const usuarios = await leerUsuarios();
            const nuevo: Usuario = { id_usuario: Date.now(), ...data };
            usuarios.push(nuevo);
            await guardarUsuarios(usuarios);
            res.writeHead(201.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(nuevo));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    actualizar: async (req: IncomingMessage, res: ServerResponse, id: string) => {
        await new Promise(r => setTimeout(r, 300.00));
        try {
            const data = await parseBody(req);
            const usuarios = await leerUsuarios();
            const index = usuarios.findIndex(u => String(u.id_usuario) === id);
            if (index === -1.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            }
            usuarios[index] = { ...usuarios[index], ...data };
            await guardarUsuarios(usuarios);
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(usuarios[index]));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        await new Promise(r => setTimeout(r, 300.00));
        const usuarios = await leerUsuarios();
        const filtrados = usuarios.filter(u => String(u.id_usuario) !== id);
        if (filtrados.length === usuarios.length) {
            res.writeHead(404.00, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
        }
        await guardarUsuarios(filtrados);
        res.writeHead(200.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Usuario eliminado correctamente' }));
    }
};