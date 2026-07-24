import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const donacionService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM donaciones');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar donaciones' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM donaciones WHERE id_donacion = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Donación no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al obtener donación' }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { id_usuario, id_empresa, id_centro, tipo_donacion, fecha_donacion, monto_monetario } = data;
            const [result]: any = await pool.query(
                'INSERT INTO donaciones (id_usuario, id_empresa, id_centro, tipo_donacion, fecha_donacion, monto_monetario) VALUES (?, ?, ?, ?, ?, ?)',
                [id_usuario ?? null, id_empresa ?? null, id_centro, tipo_donacion, fecha_donacion, monto_monetario ?? null]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Donación registrada', id_donacion: result.insertId }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear donación' }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { id_usuario, id_empresa, id_centro, tipo_donacion, fecha_donacion, monto_monetario } = data;
            const [result]: any = await pool.query(
                'UPDATE donaciones SET id_usuario = ?, id_empresa = ?, id_centro = ?, tipo_donacion = ?, fecha_donacion = ?, monto_monetario = ? WHERE id_donacion = ?',
                [id_usuario ?? null, id_empresa ?? null, id_centro, tipo_donacion, fecha_donacion, monto_monetario ?? null, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Donación no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Donación actualizada' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar donación' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM donaciones WHERE id_donacion = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Donación no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Donación eliminada' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar donación' }));
        }
    }
};