import { createServer } from 'http';
import { router } from './routes.js';

const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
    try {
        await router(req, res);
    } catch (error: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno en el servidor: ' + error.message }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});