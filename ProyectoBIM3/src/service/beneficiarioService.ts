import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const beneficiarioService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM beneficiarios');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar beneficiarios' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM beneficiarios WHERE id_beneficiario = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Beneficiario no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al obtener beneficiario' }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { cui_dpi, nombre_completo, direccion_comunidad, departamento, cantidad_dependientes } = data;
            const [result]: any = await pool.query(
                'INSERT INTO beneficiarios (cui_dpi, nombre_completo, direccion_comunidad, departamento, cantidad_dependientes) VALUES (?, ?, ?, ?, ?)',
                [cui_dpi, nombre_completo, direccion_comunidad, departamento, cantidad_dependientes ?? 0]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Beneficiario creado', id_beneficiario: result.insertId }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear beneficiario' }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { cui_dpi, nombre_completo, direccion_comunidad, departamento, cantidad_dependientes } = data;
            const [result]: any = await pool.query(
                'UPDATE beneficiarios SET cui_dpi = ?, nombre_completo = ?, direccion_comunidad = ?, departamento = ?, cantidad_dependientes = ? WHERE id_beneficiario = ?',
                [cui_dpi, nombre_completo, direccion_comunidad, departamento, cantidad_dependientes, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Beneficiario no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Beneficiario actualizado' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar beneficiario' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM beneficiarios WHERE id_beneficiario = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Beneficiario no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Beneficiario eliminado' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar beneficiario' }));
        }
    }
};