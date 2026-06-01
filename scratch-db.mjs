import mysql from 'mysql2/promise';

async function test() {
  console.log('Connecting to database...');
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'parfum',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('Querying products...');
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM products');
    console.log('SUCCESS! Product count:', rows[0].count);
    
    console.log('Querying orders...');
    const [orders] = await pool.query('SELECT COUNT(*) AS count FROM orders');
    console.log('SUCCESS! Order count:', orders[0].count);

    await pool.end();
  } catch (error) {
    console.error('DATABASE CONNECT ERROR:', error);
  }
}

test();
