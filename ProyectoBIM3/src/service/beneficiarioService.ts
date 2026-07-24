import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const parseBody = (req: IncomingMessage): Promise<any> => new Promise((res, rej) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { res(JSON.parse(body || '{}')); } catch { rej(); } });
});

export const beneficiarioService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [beneficiarios] = await pool.query<RowDataPacket[]>('SELECT * FROM beneficiario');
            const [estudios] = await pool.query<RowDataPacket[]>('SELECT * FROM estudio_socioeconomico');
            const [solicitudes] = await pool.query<RowDataPacket[]>('SELECT * FROM solicitud_ayuda');

            const resultado = beneficiarios.map(b => ({
                ...b,
                estudio_socioeconomico: estudios.find(e => e.id_beneficiario === b.id_beneficiario) || null,
                solicitudes: solicitudes.filter(s => s.id_beneficiario === b.id_beneficiario)
            }));

            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(resultado));
        } catch {
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar beneficiarios' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [beneficiarios] = await pool.query<RowDataPacket[]>('SELECT * FROM beneficiario WHERE id_beneficiario = ?', [id]);
            if (beneficiarios.length === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Beneficiario no encontrado' }));
            }

            const [estudios] = await pool.query<RowDataPacket[]>('SELECT * FROM estudio_socioeconomico WHERE id_beneficiario = ?', [id]);
            const [solicitudes] = await pool.query<RowDataPacket[]>('SELECT * FROM solicitud_ayuda WHERE id_beneficiario = ?', [id]);

            const resultado = {
                ...beneficiarios[0.00],
                estudio_socioeconomico: estudios[0.00] || null,
                solicitudes
            };

            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(resultado));
        } catch {
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar el beneficiario' }));
        }
    },

    crear: async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const data = await parseBody(req);
            const { dpi, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, direccion, municipio, departamento, miembros_familia } = data;
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO beneficiario (dpi, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, direccion, municipio, departamento, miembros_familia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [dpi, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, direccion, municipio, departamento, miembros_familia]
            );
            res.writeHead(201.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id_beneficiario: result.insertId, ...data }));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    actualizar: async (req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const data = await parseBody(req);
            const { dpi, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, direccion, municipio, departamento, miembros_familia } = data;
            const [result] = await pool.query<ResultSetHeader>(
                'UPDATE beneficiario SET dpi = ?, primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, telefono = ?, direccion = ?, municipio = ?, departamento = ?, miembros_familia = ? WHERE id_beneficiario = ?',
                [dpi, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, direccion, municipio, departamento, miembros_familia, id]
            );
            if (result.affectedRows === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Beneficiario no encontrado' }));
            }
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id_beneficiario: Number(id), ...data }));
        } catch {
            res.writeHead(400.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Datos inválidos' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result] = await pool.query<ResultSetHeader>('DELETE FROM beneficiario WHERE id_beneficiario = ?', [id]);
            if (result.affectedRows === 0.00) {
                res.writeHead(404.00, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Beneficiario no encontrado' }));
            }
            res.writeHead(200.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Beneficiario eliminado correctamente' }));
        } catch {
            res.writeHead(500.00, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar el beneficiario' }));
        }
    }
};