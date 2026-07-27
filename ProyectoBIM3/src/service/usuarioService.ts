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
            console.error('Error exacto de MySQL:', err);
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
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
            const { nombre_completo, correo_electronico, contrasena, rol, telefono } = data;

            const dominiosPermitidos = ['@gmail.com', '@yahoo.com', '@outlook.com'];
            const correoValido = dominiosPermitidos.some(dominio =>
                correo_electronico?.toLowerCase().endsWith(dominio)
            );

            if (!correoValido) {
                res.writeHead(400.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    error: 'El correo debe ser de dominio gmail.com, yahoo.com o outlook.com'
                }));
            }

            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO usuarios (nombre_completo, correo_electronico, contrasena, rol, telefono) VALUES (?, ?, ?, ?, ?)',
                [nombre_completo, correo_electronico, contrasena, rol, telefono]
            );

            res.writeHead(201.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id_usuario: result.insertId, ...data }));
        } catch (err) {
            console.error('Error al insertar usuario:', err);
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos o error en la inserción' }));
        }
    },

    actualizar: async (req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const data = await parseBody(req);
            const { nombre_completo, correo_electronico, contrasena, rol, telefono } = data;

            // Validar el dominio solo si vienen enviando un correo_electronico a actualizar
            if (correo_electronico) {
                const dominiosPermitidos = ['@gmail.com', '@yahoo.com', '@outlook.com'];
                const correoValido = dominiosPermitidos.some(dominio =>
                    correo_electronico.toLowerCase().endsWith(dominio)
                );

                if (!correoValido) {
                    res.writeHead(400.00, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({
                        error: 'El correo debe ser de dominio gmail.com, yahoo.com o outlook.com'
                    }));
                }
            }

            const [result] = await pool.query<ResultSetHeader>(
                'UPDATE usuarios SET nombre_completo = ?, correo_electronico = ?, contrasena = ?, rol = ?, telefono = ? WHERE id_usuario = ?',
                [nombre_completo, correo_electronico, contrasena, rol, telefono, id]
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
            const [result] = await pool.query<ResultSetHeader>('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
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