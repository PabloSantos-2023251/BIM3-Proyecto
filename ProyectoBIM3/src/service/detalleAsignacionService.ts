import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const detalleAsignacionService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM detalle_asignacion_inventario');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar detalles de asignación' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM detalle_asignacion_inventario WHERE id_detalle = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Detalle no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al obtener detalle de asignación' }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { id_asignacion, id_articulo, cantidad_entregada } = data;
            const [result]: any = await pool.query(
                'INSERT INTO detalle_asignacion_inventario (id_asignacion, id_articulo, cantidad_entregada) VALUES (?, ?, ?)',
                [id_asignacion, id_articulo, cantidad_entregada ?? 1]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Detalle registrado', id_detalle: result.insertId }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al registrar detalle de asignación' }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { id_asignacion, id_articulo, cantidad_entregada } = data;
            const [result]: any = await pool.query(
                'UPDATE detalle_asignacion_inventario SET id_asignacion = ?, id_articulo = ?, cantidad_entregada = ? WHERE id_detalle = ?',
                [id_asignacion, id_articulo, cantidad_entregada, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Detalle no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Detalle actualizado' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar detalle de asignación' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM detalle_asignacion_inventario WHERE id_detalle = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Detalle no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Detalle eliminado' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar detalle de asignación' }));
        }
    }
};