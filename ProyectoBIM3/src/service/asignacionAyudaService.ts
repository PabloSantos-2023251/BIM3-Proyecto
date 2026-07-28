import { ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const asignacionAyudaService = {
    obtenerTodos: async (_req: any, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM asignaciones_ayuda');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    obtenerPorId: async (_req: any, res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM asignaciones_ayuda WHERE id_asignacion = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Asignación no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { id_solicitud, fecha_asignacion, estado_entrega } = data;
            const [result]: any = await pool.query(
                'INSERT INTO asignaciones_ayuda (id_solicitud, fecha_asignacion, estado_entrega) VALUES (?, ?, ?)',
                [id_solicitud, fecha_asignacion, estado_entrega ?? 'En Bodega']
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Asignación creada', id_asignacion: result.insertId }));
        } catch (error: any) {
            console.error("ERROR REAL EN MYSQL:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear asignación de ayuda', detalle: error.message }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { id_solicitud, fecha_asignacion, estado_entrega } = data;
            const [result]: any = await pool.query(
                'UPDATE asignaciones_ayuda SET id_solicitud = ?, fecha_asignacion = ?, estado_entrega = ? WHERE id_asignacion = ?',
                [id_solicitud, fecha_asignacion, estado_entrega, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Asignación no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Asignación actualizada' }));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    eliminar: async (_req: any, res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM asignaciones_ayuda WHERE id_asignacion = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Asignación no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Asignación eliminada' }));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};