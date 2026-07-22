import { IncomingMessage, ServerResponse } from 'http';
import { leerBeneficiarios, guardarBeneficiarios } from '../data/beneficiarioData.js';
import { Beneficiario } from '../models/Beneficiario.js';

const parseBody = (req: IncomingMessage): Promise<any> => new Promise((res, rej) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { res(JSON.parse(body || '{}')); } catch { rej(); } });
});

export const beneficiarioService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        await new Promise(r => setTimeout(r, 300.00));
        const beneficiarios = await leerBeneficiarios();
        res.writeHead(200.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(beneficiarios));
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        await new Promise(r => setTimeout(r, 300.00));
        const beneficiarios = await leerBeneficiarios();
        const item = beneficiarios.find(b => String(b.id_beneficiario) === id);
        res.writeHead(item ? 200.00 : 404.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(item || { error: 'Beneficiario no encontrado' }));
    },

    crear: async (req: IncomingMessage, res: ServerResponse) => {
        await new Promise(r => setTimeout(r, 300.00));
        try {
            const data = await parseBody(req);
            const beneficiarios = await leerBeneficiarios();
            const nuevo: Beneficiario = { id_beneficiario: Date.now(), ...data };
            beneficiarios.push(nuevo);
            await guardarBeneficiarios(beneficiarios);
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
            const beneficiarios = await leerBeneficiarios();
            const index = beneficiarios.findIndex(b => String(b.id_beneficiario) === id);
            if (index === -1.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Beneficiario no encontrado' }));
            }
            beneficiarios[index] = { ...beneficiarios[index], ...data };
            await guardarBeneficiarios(beneficiarios);
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(beneficiarios[index]));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        await new Promise(r => setTimeout(r, 300.00));
        const beneficiarios = await leerBeneficiarios();
        const filtrados = beneficiarios.filter(b => String(b.id_beneficiario) !== id);
        if (filtrados.length === beneficiarios.length) {
            res.writeHead(404.00, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Beneficiario no encontrado' }));
        }
        await guardarBeneficiarios(filtrados);
        res.writeHead(200.00, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Beneficiario eliminado correctamente' }));
    }
};