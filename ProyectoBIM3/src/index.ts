import http from 'http';
import { router } from './routes.js';

const PORT = 3000;

const server = http.createServer((req, res) => {
    router(req, res);
});

server.listen(PORT, () => {
    console.log(`Servidor AyudandoGT corriendo en http://localhost:${PORT}`);
});