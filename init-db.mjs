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
      sillage VARCHAR(255) NULL,
      projection VARCHAR(255) NULL,
      longevity VARCHAR(255) NULL,
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
      image TEXT,
      quiz_result TEXT,
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

  await connection.query(`
    CREATE TABLE IF NOT EXISTS journal_articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content JSON,
      category VARCHAR(100) NOT NULL DEFAULT 'Edukasi',
      published_date VARCHAR(100),
      read_time VARCHAR(50) DEFAULT '5 menit',
      image TEXT,
      author VARCHAR(255) DEFAULT 'Tim Esscentia',
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS campaign_notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      segment VARCHAR(100) NOT NULL,
      promo_type VARCHAR(100) DEFAULT 'Private Collection Access',
      duration_days INT DEFAULT 7,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migrate users table
  const userMigrations = [
    ['login_count', 'ALTER TABLE users ADD COLUMN login_count INT DEFAULT 0'],
    ['last_login_at', 'ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL'],
    ['phone', 'ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL'],
    ['image', 'ALTER TABLE users ADD COLUMN image TEXT NULL'],
    ['quiz_result', 'ALTER TABLE users ADD COLUMN quiz_result TEXT NULL'],
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

  // Migrate campaign_notifications table
  const campaignMigrations = [
    ['duration_days', 'ALTER TABLE campaign_notifications ADD COLUMN duration_days INT DEFAULT 7'],
  ];
  for (const [col, sql] of campaignMigrations) {
    const [exists] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = 'parfum' AND TABLE_NAME = 'campaign_notifications' AND COLUMN_NAME = ?`,
      [col]
    );
    if (!Array.isArray(exists) || exists.length === 0) {
      await connection.query(sql);
      console.log(`Added campaign_notifications.${col}`);
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

  const [volPricesCol] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'parfum' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'volume_prices'`
  );
  if (!Array.isArray(volPricesCol) || volPricesCol.length === 0) {
    await connection.query('ALTER TABLE products ADD COLUMN volume_prices JSON AFTER scent');
    console.log('Added volume_prices column to products table');
  }

  const perfCols = ['sillage', 'projection', 'longevity'];
  for (const col of perfCols) {
    const [exists] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = 'parfum' AND TABLE_NAME = 'products' AND COLUMN_NAME = ?`,
      [col]
    );
    if (!Array.isArray(exists) || exists.length === 0) {
      await connection.query(`ALTER TABLE products ADD COLUMN ${col} VARCHAR(255) NULL AFTER volume_prices`);
      console.log(`Added ${col} column to products table`);
    }
  }

  console.log('Database parfum and tables created successfully');
  await connection.end();
  process.exit(0);
}

init().catch(console.error);
