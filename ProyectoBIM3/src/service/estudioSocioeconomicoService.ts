import { ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const estudioSocioeconomicoService = {
    obtenerTodos: async (_req: any, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM estudios_socioeconomicos');
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
                return res.end(JSON.stringify({ error: 'ID de estudio inválido' }));
            }
            const [rows]: any = await pool.query('SELECT * FROM estudios_socioeconomicos WHERE id_estudio = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Estudio socioeconómico no encontrado' }));
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
            const { id_beneficiario, id_trabajador, ingreso_mensual_estimado, nivel_vulnerabilidad, fecha_evaluacion } = data;

            if (!id_beneficiario || !id_trabajador || !ingreso_mensual_estimado || !nivel_vulnerabilidad || !fecha_evaluacion) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Faltan campos obligatorios en el estudio socioeconómico' }));
            }

            // Validar existencia del beneficiario
            const [benExiste]: any = await pool.query('SELECT id_beneficiario FROM beneficiarios WHERE id_beneficiario = ?', [id_beneficiario]);
            if (benExiste.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: `El beneficiario con ID ${id_beneficiario} no existe` }));
            }

            const [result]: any = await pool.query(
                'INSERT INTO estudios_socioeconomicos (id_beneficiario, id_trabajador, ingreso_mensual_estimado, nivel_vulnerabilidad, fecha_evaluacion) VALUES (?, ?, ?, ?, ?)',
                [id_beneficiario, id_trabajador, ingreso_mensual_estimado, nivel_vulnerabilidad, fecha_evaluacion]
            );

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Estudio socioeconómico creado', id_estudio: result.insertId }));
        } catch (error: any) {
            console.error("Error al crear estudio:", error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear estudio socioeconómico', detalle: error.message }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            if (!id || isNaN(Number(id))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido' }));
            }
            const { id_beneficiario, id_trabajador, ingreso_mensual_estimado, nivel_vulnerabilidad, fecha_evaluacion } = data;
            const [result]: any = await pool.query(
                'UPDATE estudios_socioeconomicos SET id_beneficiario = ?, id_trabajador = ?, ingreso_mensual_estimado = ?, nivel_vulnerabilidad = ?, fecha_evaluacion = ? WHERE id_estudio = ?',
                [id_beneficiario, id_trabajador, ingreso_mensual_estimado, nivel_vulnerabilidad, fecha_evaluacion, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Estudio no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Estudio actualizado' }));
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
            const [result]: any = await pool.query('DELETE FROM estudios_socioeconomicos WHERE id_estudio = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Estudio no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Estudio eliminado' }));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};