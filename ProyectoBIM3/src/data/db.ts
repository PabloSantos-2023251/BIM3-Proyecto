import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'IN5CM',
    password: process.env.DB_PASSWORD || '?donmoA5m@',
    database: process.env.DB_NAME || 'ayudandogtin5cm',
    waitForConnections: true,
    connectionLimit: 10.00,
    queueLimit: 0.00
});