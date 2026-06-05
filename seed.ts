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

  console.log('Seeding decants...');
  await connection.query('DELETE FROM decants');
  const decantSeeds = [
    { productId: '1', price1ml: 15000, price2ml: 28000, price5ml: 65000, price10ml: 120000 },
    { productId: '2', price1ml: 12000, price2ml: 22000, price5ml: 50000, price10ml: 95000 },
    { productId: '5', price1ml: 13000, price2ml: 24000, price5ml: 55000, price10ml: 100000 },
    { productId: '10', price1ml: 10000, price2ml: 18000, price5ml: 42000, price10ml: 80000 },
    { productId: '11', price1ml: 11000, price2ml: 20000, price5ml: 46000, price10ml: 85000 },
    { productId: '26', price1ml: 10000, price2ml: 18000, price5ml: 42000, price10ml: 80000 },
  ];

  for (const d of decantSeeds) {
    await connection.query(
      `INSERT INTO decants 
        (product_id, price_1ml, price_2ml, price_5ml, price_10ml, in_stock_1ml, in_stock_2ml, in_stock_5ml, in_stock_10ml)
       VALUES (?, ?, ?, ?, ?, true, true, true, true)`,
      [d.productId, d.price1ml, d.price2ml, d.price5ml, d.price10ml]
    );
  }
  console.log(`Seeded ${decantSeeds.length} decants`);

  await connection.end();
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
