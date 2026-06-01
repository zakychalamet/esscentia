import mysql from 'mysql2/promise';

const globalForDb = globalThis as unknown as {
  pool: mysql.Pool | undefined;
};

export const pool =
  globalForDb.pool ??
  mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'parfum',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export default pool;