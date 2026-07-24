import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const centroAcopioService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM centros_acopio');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar centros de acopio' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM centros_acopio WHERE id_centro = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Centro de acopio no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al obtener centro de acopio' }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { nombre_centro, direccion, departamento } = data;
            const [result]: any = await pool.query(
                'INSERT INTO centros_acopio (nombre_centro, direccion, departamento) VALUES (?, ?, ?)',
                [nombre_centro, direccion, departamento]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Centro de acopio creado', id_centro: result.insertId }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear centro de acopio' }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { nombre_centro, direccion, departamento } = data;
            const [result]: any = await pool.query(
                'UPDATE centros_acopio SET nombre_centro = ?, direccion = ?, departamento = ? WHERE id_centro = ?',
                [nombre_centro, direccion, departamento, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Centro de acopio no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Centro de acopio actualizado' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar centro de acopio' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM centros_acopio WHERE id_centro = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Centro de acopio no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Centro de acopio eliminado' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar centro de acopio' }));
        }
    }
};