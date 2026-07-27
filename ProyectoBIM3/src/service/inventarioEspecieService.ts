import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const inventarioEspecieService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM inventario_especie');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar inventario' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM inventario_especie WHERE id_articulo = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Artículo no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al obtener artículo' }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { id_donacion, categoria, descripcion, cantidad_disponible } = data;
            const [result]: any = await pool.query(
                'INSERT INTO inventario_especie (id_donacion, categoria, descripcion, cantidad_disponible) VALUES (?, ?, ?, ?)',
                [id_donacion, categoria, descripcion, cantidad_disponible ?? 0]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Artículo agregado al inventario', id_articulo: result.insertId }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al agregar artículo al inventario' }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { id_donacion, categoria, descripcion, cantidad_disponible } = data;
            const [result]: any = await pool.query(
                'UPDATE inventario_especie SET id_donacion = ?, categoria = ?, descripcion = ?, cantidad_disponible = ? WHERE id_articulo = ?',
                [id_donacion, categoria, descripcion, cantidad_disponible, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Artículo no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Artículo actualizado' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar artículo' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM inventario_especie WHERE id_articulo = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Artículo no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Artículo eliminado' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar artículo' }));
        }
    }
};