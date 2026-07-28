import { ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const donacionService = {
    obtenerTodos: async (_req: any, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM donaciones');
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
                return res.end(JSON.stringify({ error: 'ID de donación inválido' }));
            }
            const [rows]: any = await pool.query('SELECT * FROM donaciones WHERE id_donacion = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Donación no encontrada' }));
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
            const { id_usuario, id_empresa, id_centro, tipo_donacion, fecha_donacion, monto_monetario } = data;

            // Validación previa obligatoria
            if (!id_centro || !tipo_donacion || !fecha_donacion) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Faltan campos obligatorios (id_centro, tipo_donacion, fecha_donacion)' }));
            }

            // Validar que el centro de acopio exista
            const [centroExiste]: any = await pool.query('SELECT id_centro FROM centros_acopio WHERE id_centro = ?', [id_centro]);
            if (centroExiste.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: `El centro de acopio con ID ${id_centro} no existe` }));
            }

            const [result]: any = await pool.query(
                'INSERT INTO donaciones (id_usuario, id_empresa, id_centro, tipo_donacion, fecha_donacion, monto_monetario) VALUES (?, ?, ?, ?, ?, ?)',
                [id_usuario ?? null, id_empresa ?? null, id_centro, tipo_donacion, fecha_donacion, monto_monetario ?? null]
            );

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Donación creada exitosamente', id_donacion: result.insertId }));
        } catch (error: any) {
            console.error("Error al crear donación:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear donación', detalle: error.message }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            if (!id || isNaN(Number(id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido' }));
            }
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
            const [result]: any = await pool.query('DELETE FROM donaciones WHERE id_donacion = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Donación no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Donación eliminada' }));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};