import { ServerResponse } from 'http';
import { pool } from '../data/db.js';

export const usuarioService = {
    obtenerTodos: async (res: ServerResponse) => {
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    obtenerPorId: async (res: ServerResponse, id: string) => {
        try {
            const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
            if (rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
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
            const { nombre_completo, correo_electronico, contrasena, telefono, rol } = data;
            const [result]: any = await pool.query(
                'INSERT INTO usuarios (nombre_completo, correo_electronico, contrasena, telefono, rol) VALUES (?, ?, ?, ?, ?)',
                [nombre_completo, correo_electronico, contrasena, telefono ?? null, rol]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Usuario creado', id_usuario: result.insertId }));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    actualizar: async (data: any, res: ServerResponse, id: string) => {
        try {
            const { nombre_completo, correo_electronico, contrasena, telefono, rol } = data;
            const [result]: any = await pool.query(
                'UPDATE usuarios SET nombre_completo = ?, correo_electronico = ?, contrasena = ?, telefono = ?, rol = ? WHERE id_usuario = ?',
                [nombre_completo, correo_electronico, contrasena, telefono ?? null, rol, id]
            );
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Usuario actualizado' }));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    },

    eliminar: async (res: ServerResponse, id: string) => {
        try {
            const [result]: any = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
            if (result.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: 'Usuario eliminado' }));
        } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};