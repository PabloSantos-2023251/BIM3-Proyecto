import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const parseBody = (req: IncomingMessage): Promise<any> => new Promise((res, rej) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { res(JSON.parse(body || '{}')); } catch { rej(); } });
});

export const usuarioService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM usuarios');
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (err) {
            console.error('Error exacto de MySQL:', err)
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar la base de datos' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
            if (rows.length === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            }
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0.00]));
        } catch (err) {
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar la base de datos' }));
        }
    },

    crear: async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const data = await parseBody(req);
            const { nombre, correo, contrasenia, rol, telefono } = data;
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO usuario (nombre, correo, contrasenia, rol, telefono) VALUES (?, ?, ?, ?, ?)',
                [nombre, correo, contrasenia, rol, telefono]
            );
            res.writeHead(201.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id_usuario: result.insertId, ...data }));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos o error en la inserción' }));
        }
    },

    actualizar: async (req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const data = await parseBody(req);
            const { nombre, correo, contrasenia, rol, telefono } = data;
            const [result] = await pool.query<ResultSetHeader>(
                'UPDATE usuario SET nombre = ?, correo = ?, contrasenia = ?, rol = ?, telefono = ? WHERE id_usuario = ?',
                [nombre, correo, contrasenia, rol, telefono, id]
            );
            if (result.affectedRows === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            }
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id_usuario: Number(id), ...data }));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result] = await pool.query<ResultSetHeader>('DELETE FROM usuario WHERE id_usuario = ?', [id]);
            if (result.affectedRows === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            }
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Usuario eliminado correctamente' }));
        } catch {
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar el usuario' }));
        }
    }
};