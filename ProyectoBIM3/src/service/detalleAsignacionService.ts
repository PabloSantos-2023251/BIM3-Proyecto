import { ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const detalleAsignacionService = {
    obtenerTodos: async (_req: any, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM detalle_asignacion_inventario');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    obtenerPorId: async (_req: any, res: ServerResponse, id: string) => {
        try {
            if (!id || isNaN(Number(id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID de detalle inválido' }));
            }
            const [rows]: any = await pool.query('SELECT * FROM detalle_asignacion_inventario WHERE id_detalle = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Detalle no encontrado' }));
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
            const { id_asignacion, id_articulo, cantidad_entregada } = data;

            if (!id_asignacion || !id_articulo || !cantidad_entregada) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Faltan campos obligatorios (id_asignacion, id_articulo, cantidad_entregada)' }));
            }

            // Validar que exista la asignación
            const [asigExiste]: any = await pool.query('SELECT id_asignacion FROM asignaciones_ayuda WHERE id_asignacion = ?', [id_asignacion]);
            if (asigExiste.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: `La asignación con ID ${id_asignacion} no existe` }));
            }

            // Validar que exista el artículo en inventario
            const [artExiste]: any = await pool.query('SELECT id_articulo FROM inventario_especie WHERE id_articulo = ?', [id_articulo]);
            if (artExiste.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: `El artículo de inventario con ID ${id_articulo} no existe` }));
            }

            const [result]: any = await pool.query(
                'INSERT INTO detalle_asignacion_inventario (id_asignacion, id_articulo, cantidad_entregada) VALUES (?, ?, ?)',
                [id_asignacion, id_articulo, cantidad_entregada]
            );

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Detalle de asignación creado', id_detalle: result.insertId }));
        } catch (error: any) {
            console.error("Error al crear detalle:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear detalle de asignación', detalle: error.message }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            if (!id || isNaN(Number(id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido' }));
            }
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
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    eliminar: async (_req: any, res: ServerResponse, id: string) => {
        try {
            if (!id || isNaN(Number(id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido' }));
            }
            const [result]: any = await pool.query('DELETE FROM detalle_asignacion_inventario WHERE id_detalle = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Detalle no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Detalle eliminado' }));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};