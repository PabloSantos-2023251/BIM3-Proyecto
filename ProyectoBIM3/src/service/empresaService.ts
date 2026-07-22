import { IncomingMessage, ServerResponse } from 'http';
import { leerEmpresas, guardarEmpresas } from '../data/empresaData.js';
import { EmpresaAliada } from '../models/EmpresaAliada.js';

const parseBody = (req: IncomingMessage): Promise<any> => new Promise((res, rej) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { res(JSON.parse(body || '{}')); } catch { rej(); } });
});

export const empresaService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        await new Promise(r => setTimeout(r, 300.00));
        const empresas = await leerEmpresas();
        res.writeHead(200.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(empresas));
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        await new Promise(r => setTimeout(r, 300.00));
        const empresas = await leerEmpresas();
        const item = empresas.find(e => String(e.id_empresa) === id);
        res.writeHead(item ? 200.00 : 404.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(item || { error: 'Empresa no encontrada' }));
    },

    crear: async (req: IncomingMessage, res: ServerResponse) => {
        await new Promise(r => setTimeout(r, 300.00));
        try {
            const data = await parseBody(req);
            const empresas = await leerEmpresas();
            const nueva: EmpresaAliada = { id_empresa: Date.now(), ...data };
            empresas.push(nueva);
            await guardarEmpresas(empresas);
            res.writeHead(201.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(nueva));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    actualizar: async (req: IncomingMessage, res: ServerResponse, id: string) => {
        await new Promise(r => setTimeout(r, 300.00));
        try {
            const data = await parseBody(req);
            const empresas = await leerEmpresas();
            const index = empresas.findIndex(e => String(e.id_empresa) === id);
            if (index === -1.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Empresa no encontrada' }));
            }
            empresas[index] = { ...empresas[index], ...data };
            await guardarEmpresas(empresas);
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(empresas[index]));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        await new Promise(r => setTimeout(r, 300.00));
        const empresas = await leerEmpresas();
        const filtrados = empresas.filter(e => String(e.id_empresa) !== id);
        if (filtrados.length === empresas.length) {
            res.writeHead(404.00, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Empresa no encontrada' }));
        }
        await guardarEmpresas(filtrados);
        res.writeHead(200.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Empresa eliminada correctamente' }));
    }
};