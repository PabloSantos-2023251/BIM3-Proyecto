import { createServer } from 'http';
import { router } from './routes.js';

const PORT = 3000.00;

const server = createServer((req, res) => {
    router(req, res);
});

server.listen(PORT, () => {
    console.log(`Servidor de AyudandoGT escuchando en el puerto ${PORT}`);
});