import { IncomingMessage, ServerResponse } from 'http';
import { usuarioService } from './service/usuarioService.js';
import { beneficiarioService } from './service/beneficiarioService.js';
import { empresaService } from './service/empresaService.js';


export async function router(req: IncomingMessage, res: ServerResponse) {
    const rawHost = req.headers.host || 'localhost:3000';
    const cleanHost = rawHost.replace(/\.00/g, '');
    const urlParsed = new URL(req.url ?? '/', `http://${cleanHost}`);

    const ruta = urlParsed.pathname;
    const metodo = req.method ?? '';
    const id = urlParsed.searchParams.get('id') ?? '';

    // Headers CORS básicos para evitar bloqueos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (metodo === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    // 1. USUARIOS
    if (ruta === '/usuarios') {
        if (metodo === 'GET') return id ? usuarioService.obtenerPorId(req, res, id) : usuarioService.obtenerTodos(req, res);
        if (metodo === 'POST') return usuarioService.crear(req, res);
        if (metodo === 'PUT' && id) return usuarioService.actualizar(req, res, id);
        if (metodo === 'DELETE' && id) return usuarioService.eliminar(req, res, id);
    }

    // 2. BENEFICIARIOS
    if (ruta === '/beneficiarios') {
        if (metodo === 'GET') return id ? beneficiarioService.obtenerPorId(req, res, id) : beneficiarioService.obtenerTodos(req, res);
        if (metodo === 'POST') return beneficiarioService.crear(req, res);
        if (metodo === 'PUT' && id) return beneficiarioService.actualizar(req, res, id);
        if (metodo === 'DELETE' && id) return beneficiarioService.eliminar(req, res, id);
    }

    // 3. EMPRESAS ALIADAS
    if (ruta === '/empresas-aliadas' || ruta === '/empresas') {
        if (metodo === 'GET') return id ? empresaService.obtenerPorId(req, res, id) : empresaService.obtenerTodos(req, res);
        if (metodo === 'POST') return empresaService.crear(req, res);
        if (metodo === 'PUT' && id) return empresaService.actualizar(req, res, id);
        if (metodo === 'DELETE' && id) return empresaService.eliminar(req, res, id);
    }

    // 404 SI NO COINCIDE NINGUNA RUTA
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
}