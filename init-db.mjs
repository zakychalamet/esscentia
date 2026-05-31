import mysql from 'mysql2/promise';

async function init() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS parfum;');
  await connection.query('USE parfum;');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      image TEXT,
      description TEXT,
      category VARCHAR(50) NOT NULL DEFAULT 'unisex',
      family VARCHAR(50) NOT NULL DEFAULT 'Woody',
      intensity VARCHAR(50) NOT NULL DEFAULT 'EDP',
      scent JSON,
      volume INT NOT NULL DEFAULT 50,
      rating DECIMAL(3, 2) DEFAULT 0,
      reviews INT DEFAULT 0,
      inStock BOOLEAN DEFAULT true,
      isBestseller BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      phone VARCHAR(50),
      login_count INT DEFAULT 0,
      last_login_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      subtotal DECIMAL(12, 2) NOT NULL,
      shipping_cost DECIMAL(12, 2) DEFAULT 0,
      total_amount DECIMAL(12, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'completed',
      ship_method VARCHAR(50),
      payment_method VARCHAR(50),
      shipping_name VARCHAR(255),
      shipping_email VARCHAR(255),
      shipping_phone VARCHAR(50),
      shipping_address TEXT,
      shipping_city VARCHAR(100),
      shipping_province VARCHAR(100),
      shipping_postal_code VARCHAR(20),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(12, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // Migrate users table
  const userMigrations = [
    ['login_count', 'ALTER TABLE users ADD COLUMN login_count INT DEFAULT 0'],
    ['last_login_at', 'ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL'],
    ['phone', 'ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL'],
  ];
  for (const [col, sql] of userMigrations) {
    const [exists] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = 'parfum' AND TABLE_NAME = 'users' AND COLUMN_NAME = ?`,
      [col]
    );
    if (!Array.isArray(exists) || exists.length === 0) {
      await connection.query(sql);
      console.log(`Added users.${col}`);
    }
  }

  // Migrate existing tables
  const [scentCol] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'parfum' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'scent'`
  );
  if (!Array.isArray(scentCol) || scentCol.length === 0) {
    await connection.query('ALTER TABLE products ADD COLUMN scent JSON AFTER intensity');
    console.log('Added scent column to products table');
  }

  const [imageCol] = await connection.query(
    `SELECT DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'parfum' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'image'`
  );
  const imageMeta = Array.isArray(imageCol) ? imageCol[0] : null;
  if (
    imageMeta &&
    imageMeta.DATA_TYPE === 'varchar' &&
    (imageMeta.CHARACTER_MAXIMUM_LENGTH === null || imageMeta.CHARACTER_MAXIMUM_LENGTH < 2048)
  ) {
    await connection.query('ALTER TABLE products MODIFY COLUMN image TEXT');
    console.log('Expanded image column to TEXT');
  }

  console.log('Database parfum and tables created successfully');
  await connection.end();
  process.exit(0);
}

init().catch(console.error);
