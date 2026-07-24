import { IncomingMessage, ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const empresaService = {
    obtenerTodos: async (_req: IncomingMessage, res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM empresas_aliadas');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al consultar empresas aliadas' }));
        }
    },

    obtenerPorId: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM empresas_aliadas WHERE id_empresa = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Empresa no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows[0]));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al obtener empresa' }));
        }
    },

    crear: async (data: any, res: ServerResponse) => {
        try {
            const { id_usuario, razon_social, tipo_relacion, contacto_corporativo } = data;
            const [result]: any = await pool.query(
                'INSERT INTO empresas_aliadas (id_usuario, razon_social, tipo_relacion, contacto_corporativo) VALUES (?, ?, ?, ?)',
                [id_usuario, razon_social, tipo_relacion, contacto_corporativo]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Empresa creada', id_empresa: result.insertId }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al crear empresa' }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { id_usuario, razon_social, tipo_relacion, contacto_corporativo } = data;
            const [result]: any = await pool.query(
                'UPDATE empresas_aliadas SET id_usuario = ?, razon_social = ?, tipo_relacion = ?, contacto_corporativo = ? WHERE id_empresa = ?',
                [id_usuario, razon_social, tipo_relacion, contacto_corporativo, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Empresa no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Empresa actualizada' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al actualizar empresa' }));
        }
    },

    eliminar: async (_req: IncomingMessage, res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM empresas_aliadas WHERE id_empresa = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Empresa no encontrada' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Empresa eliminada' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al eliminar empresa' }));
        }
    }
};