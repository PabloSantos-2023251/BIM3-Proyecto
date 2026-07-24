import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const parseBody = (req: IncomingMessage): Promise<any> => new Promise((res, rej) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { res(JSON.parse(body || '{}')); } catch { rej(); } });
});

export const empresaService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM empresa');
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch {
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar las empresas' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM empresa WHERE id_empresa = ?', [id]);
            if (rows.length === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Empresa no encontrada' }));
            }
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0.00]));
        } catch {
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar la empresa' }));
        }
    },

    crear: async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const data = await parseBody(req);
            const { nombre_empresa, nit, contacto, telefono, correo } = data;
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO empresa (nombre_empresa, nit, contacto, telefono, correo) VALUES (?, ?, ?, ?, ?)',
                [nombre_empresa, nit, contacto, telefono, correo]
            );
            res.writeHead(201.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id_empresa: result.insertId, ...data }));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    actualizar: async (req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const data = await parseBody(req);
            const { nombre_empresa, nit, contacto, telefono, correo } = data;
            const [result] = await pool.query<ResultSetHeader>(
                'UPDATE empresa SET nombre_empresa = ?, nit = ?, contacto = ?, telefono = ?, correo = ? WHERE id_empresa = ?',
                [nombre_empresa, nit, contacto, telefono, correo, id]
            );
            if (result.affectedRows === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Empresa no encontrada' }));
            }
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id_empresa: Number(id), ...data }));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result] = await pool.query<ResultSetHeader>('DELETE FROM empresa WHERE id_empresa = ?', [id]);
            if (result.affectedRows === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Empresa no encontrada' }));
            }
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Empresa eliminada correctamente' }));
        } catch {
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar la empresa' }));
        }
    }
};