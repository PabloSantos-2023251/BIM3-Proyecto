import { IncomingMessage, ServerResponse } from 'http';
import { asignacionAyudaService } from './service/asignacionAyudaService.js';
import { beneficiarioService } from './service/beneficiarioService.js';
import { centroAcopioService } from './service/centroAcopioService.js';
import { detalleAsignacionService } from './service/detalleAsignacionService.js';
import { donacionService } from './service/donacionService.js';
import { empresaService } from './service/empresaService.js';
import { estudioSocioeconomicoService } from './service/estudioSocioeconomicoService.js';
import { inventarioEspecieService } from './service/inventarioEspecieService.js';
import { solicitudAyudaService } from './service/solicitudAyudaService.js';
import { usuarioService } from './service/usuarioService.js';

// Helper para leer el body (JSON) en peticiones POST y PUT
const obtenerBodyJSON = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', (err) => reject(err));
    });
};

export async function router(req: IncomingMessage, res: ServerResponse) {
    const urlParsed = new URL(req.url ?? '/', `http://${req.headers.host || 'localhost:3000'}`);
    const ruta = urlParsed.pathname;
    const metodo = req.method ?? '';
    const id = urlParsed.searchParams.get('id') ?? '';

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (metodo === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    try {
        // 1. ASIGNACIONES DE AYUDA
        if (ruta === '/asignaciones-ayuda' || ruta === '/asignacionAyuda') {
            if (metodo === 'GET') return id ? asignacionAyudaService.obtenerPorId(req, res, id) : asignacionAyudaService.obtenerTodos(req, res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return asignacionAyudaService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return asignacionAyudaService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return asignacionAyudaService.eliminar(req, res, id);
        }

        // 2. BENEFICIARIOS
        if (ruta === '/beneficiarios' || ruta === '/beneficiario') {
            if (metodo === 'GET') return id ? beneficiarioService.obtenerPorId(res, id) : beneficiarioService.obtenerTodos(res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return beneficiarioService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return beneficiarioService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return beneficiarioService.eliminar(res, id);
        }

        // 3. CENTROS DE ACOPIO
        if (ruta === '/centros-acopio' || ruta === '/centroAcopio') {
            if (metodo === 'GET') return id ? centroAcopioService.obtenerPorId(req, res, id) : centroAcopioService.obtenerTodos(req, res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return centroAcopioService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return centroAcopioService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return centroAcopioService.eliminar(req, res, id);
        }

        // 4. DETALLES DE ASIGNACIÓN
        if (ruta === '/detalles-asignacion' || ruta === '/detalleAsignacion') {
            if (metodo === 'GET') return id ? detalleAsignacionService.obtenerPorId(req, res, id) : detalleAsignacionService.obtenerTodos(req, res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return detalleAsignacionService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return detalleAsignacionService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return detalleAsignacionService.eliminar(req, res, id);
        }

        // 5. DONACIONES
        if (ruta === '/donaciones' || ruta === '/donacion') {
            if (metodo === 'GET') return id ? donacionService.obtenerPorId(req, res, id) : donacionService.obtenerTodos(req, res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return donacionService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return donacionService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return donacionService.eliminar(req, res, id);
        }

        // 6. EMPRESAS
        if (ruta === '/empresas' || ruta === '/empresa' || ruta === '/empresas-aliadas') {
            if (metodo === 'GET') return id ? empresaService.obtenerPorId(res, id) : empresaService.obtenerTodos(res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return empresaService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return empresaService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return empresaService.eliminar(res, id);
        }

        // 7. ESTUDIOS SOCIOECONOMICOS (Actualizado con soporte para req, res, id)
        if (ruta === '/estudios-socioeconomicos' || ruta === '/estudioSocioeconomico') {
            if (metodo === 'GET') return id ? estudioSocioeconomicoService.obtenerPorId(req, res, id) : estudioSocioeconomicoService.obtenerTodos(req, res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return estudioSocioeconomicoService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return estudioSocioeconomicoService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return estudioSocioeconomicoService.eliminar(req, res, id);
        }

        // 8. INVENTARIO ESPECIE
        if (ruta === '/inventarios-especie' || ruta === '/inventarioEspecie') {
            if (metodo === 'GET') return id ? inventarioEspecieService.obtenerPorId(req, res, id) : inventarioEspecieService.obtenerTodos(req, res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return inventarioEspecieService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return inventarioEspecieService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return inventarioEspecieService.eliminar(req, res, id);
        }

        // 9. SOLICITUDES DE AYUDA
        if (ruta === '/solicitudes-ayuda' || ruta === '/solicitudAyuda') {
            if (metodo === 'GET') return id ? solicitudAyudaService.obtenerPorId(req, res, id) : solicitudAyudaService.obtenerTodos(req, res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return solicitudAyudaService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return solicitudAyudaService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return solicitudAyudaService.eliminar(req, res, id);
        }

        // 10. USUARIOS
        if (ruta === '/usuarios' || ruta === '/usuario') {
            if (metodo === 'GET') return id ? usuarioService.obtenerPorId(res, id) : usuarioService.obtenerTodos(res);
            if (metodo === 'POST') {
                const data = await obtenerBodyJSON(req);
                return usuarioService.crear(data, res);
            }
            if (metodo === 'PUT' && id) {
                const data = await obtenerBodyJSON(req);
                return usuarioService.actualizar(data, res, id);
            }
            if (metodo === 'DELETE' && id) return usuarioService.eliminar(res, id);
        }

        // Ruta no encontrada
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));

    } catch (error: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON malformado o error en la petición: ' + error.message }));
    }
}