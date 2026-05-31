import mysql from 'mysql2/promise';
import { products } from './lib/products';

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'parfum',
  });

  await connection.query('DELETE FROM products');

  for (const p of products) {
    await connection.query(
      `INSERT INTO products
        (id, name, brand, price, image, description, category, family, intensity, scent, volume, rating, reviews, inStock, isBestseller)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.name,
        p.brand,
        p.price,
        p.image,
        p.description,
        p.category,
        p.family,
        p.intensity,
        JSON.stringify(p.scent),
        p.volume,
        p.rating,
        p.reviews,
        p.inStock,
        p.isBestseller || false,
      ]
    );
  }

  console.log(`Seeded ${products.length} products into parfum database`);
  await connection.end();
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
