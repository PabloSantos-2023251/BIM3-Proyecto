import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const solicitudAyudaService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM solicitudes_ayuda');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar solicitudes de ayuda' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM solicitudes_ayuda WHERE id_solicitud = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Solicitud no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al obtener solicitud de ayuda' }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { id_beneficiario, id_empresa_receptora, descripcion_necesidad, estado_solicitud, fecha_solicitud } = data;
            const [result]: any = await pool.query(
                'INSERT INTO solicitudes_ayuda (id_beneficiario, id_empresa_receptora, descripcion_necesidad, estado_solicitud, fecha_solicitud) VALUES (?, ?, ?, ?, ?)',
                [id_beneficiario ?? null, id_empresa_receptora ?? null, descripcion_necesidad, estado_solicitud ?? 'Pendiente', fecha_solicitud]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Solicitud creada', id_solicitud: result.insertId }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear solicitud de ayuda' }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { id_beneficiario, id_empresa_receptora, descripcion_necesidad, estado_solicitud, fecha_solicitud } = data;
            const [result]: any = await pool.query(
                'UPDATE solicitudes_ayuda SET id_beneficiario = ?, id_empresa_receptora = ?, descripcion_necesidad = ?, estado_solicitud = ?, fecha_solicitud = ? WHERE id_solicitud = ?',
                [id_beneficiario ?? null, id_empresa_receptora ?? null, descripcion_necesidad, estado_solicitud, fecha_solicitud, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Solicitud no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Solicitud actualizada' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar solicitud' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM solicitudes_ayuda WHERE id_solicitud = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Solicitud no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Solicitud eliminada' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar solicitud' }));
        }
    }
};