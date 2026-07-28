import { ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const asignacionAyudaService = {
    obtenerTodos: async (_req: any, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM asignaciones_ayuda');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error: any) {
            console.error("Error en obtenerTodos asignaciones:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error interno al obtener asignaciones' }));
        }
    },

    obtenerPorId: async (_req: any, res: ServerResponse, id: string) => {
        try {
            // Validación previa: Asegurar que el ID sea numérico o válido
            if (!id || isNaN(Number(id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'El ID proporcionado no es válido' }));
            }

            const [rows]: any = await pool.query('SELECT * FROM asignaciones_ayuda WHERE id_asignacion = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Asignación no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error: any) {
            console.error("Error en obtenerPorId asignaciones:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error interno al obtener la asignación' }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { id_solicitud, fecha_asignacion, estado_entrega } = data;

            // 1. Validación previa de campos obligatorios
            if (!id_solicitud || !fecha_asignacion) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Faltan campos obligatorios (id_solicitud, fecha_asignacion)' }));
            }

            // 2. Validación de negocio: Verificar si la solicitud de ayuda realmente existe antes de insertar
            const [solicitudExiste]: any = await pool.query('SELECT id_solicitud FROM solicitudes_ayuda WHERE id_solicitud = ?', [id_solicitud]);
            if (solicitudExiste.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: `La solicitud de ayuda con ID ${id_solicitud} no existe en la base de datos` }));
            }

            const [result]: any = await pool.query(
                'INSERT INTO asignaciones_ayuda (id_solicitud, fecha_asignacion, estado_entrega) VALUES (?, ?, ?)',
                [id_solicitud, fecha_asignacion, estado_entrega ?? 'En Bodega']
            );

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Asignación creada exitosamente', id_asignacion: result.insertId }));
        } catch (error: any) {
            console.error("ERROR REAL EN CREAR ASIGNACIÓN:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear asignación de ayuda', detalle: error.message }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            if (!id || isNaN(Number(id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido para actualizar' }));
            }

            const { id_solicitud, fecha_asignacion, estado_entrega } = data;
            const [result]: any = await pool.query(
                'UPDATE asignaciones_ayuda SET id_solicitud = ?, fecha_asignacion = ?, estado_entrega = ? WHERE id_asignacion = ?',
                [id_solicitud, fecha_asignacion, estado_entrega, id]
            );

            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Asignación no encontrada para actualizar' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Asignación actualizada exitosamente' }));
        } catch (error: any) {
            console.error("Error en actualizar asignación:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error interno al actualizar la asignación' }));
        }
    },

    eliminar: async (_req: any, res: ServerResponse, id: string) => {
        try {
            if (!id || isNaN(Number(id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido para eliminar' }));
            }

            const [result]: any = await pool.query('DELETE FROM asignaciones_ayuda WHERE id_asignacion = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Asignación no encontrada para eliminar' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Asignación eliminada exitosamente' }));
        } catch (error: any) {
            console.error("Error en eliminar asignación:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error interno al eliminar la asignación' }));
        }
    }
};