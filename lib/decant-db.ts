import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from './db';
import type { Product } from './products';
import { rowToProduct } from './product-db';

export interface Decant {
  id: string;
  productId: string;
  price1ml: number;
  price2ml: number;
  price5ml: number;
  price10ml: number;
  inStock1ml: boolean;
  inStock2ml: boolean;
  inStock5ml: boolean;
  inStock10ml: boolean;
  stock1ml?: number;
  stock2ml?: number;
  stock5ml?: number;
  stock10ml?: number;
  createdAt?: Date;
}

interface DecantRow extends RowDataPacket {
  id: number;
  product_id: number;
  price_1ml: number;
  price_2ml: number;
  price_5ml: number;
  price_10ml: number;
  in_stock_1ml: number | boolean;
  in_stock_2ml: number | boolean;
  in_stock_5ml: number | boolean;
  in_stock_10ml: number | boolean;
  stock_1ml: number;
  stock_2ml: number;
  stock_5ml: number;
  stock_10ml: number;
  created_at: Date;
}

function rowToDecant(row: DecantRow): Decant {
  return {
    id: String(row.id),
    productId: String(row.product_id),
    price1ml: Number(row.price_1ml),
    price2ml: Number(row.price_2ml),
    price5ml: Number(row.price_5ml),
    price10ml: Number(row.price_10ml),
    inStock1ml: Boolean(row.in_stock_1ml),
    inStock2ml: Boolean(row.in_stock_2ml),
    inStock5ml: Boolean(row.in_stock_5ml),
    inStock10ml: Boolean(row.in_stock_10ml),
    stock1ml: Number(row.stock_1ml) || 0,
    stock2ml: Number(row.stock_2ml) || 0,
    stock5ml: Number(row.stock_5ml) || 0,
    stock10ml: Number(row.stock_10ml) || 0,
    createdAt: row.created_at,
  };
}

export async function getDecantByProductId(productId: string): Promise<Decant | null> {
  const [rows] = await pool.query<DecantRow[]>(
    'SELECT * FROM decants WHERE product_id = ?',
    [productId]
  );
  if (!rows.length) return null;
  return rowToDecant(rows[0]);
}

export async function getAllDecants(): Promise<(Decant & { product: Product })[]> {
  const [rows] = await pool.query<(DecantRow & { name: string; brand: string; price: number; image: string; description: string; category: string; family: string; intensity: string; scent: string; volume: number; rating: number; reviews: number; inStock: number; isBestseller: number; volume_prices: string; sillage: string; longevity: string; projection: string })[]>(
    `SELECT d.*, p.name, p.brand, p.price, p.image, p.description, p.category, p.family, p.intensity, p.scent, p.volume, p.rating, p.reviews, p.inStock, p.isBestseller, p.volume_prices, p.sillage, p.longevity, p.projection 
     FROM decants d 
     JOIN products p ON d.product_id = p.id 
     ORDER BY d.id DESC`
  );
  return rows.map((row) => {
    const decant = rowToDecant(row);
    // Cast and extract product properties
    const product = rowToProduct({
      id: row.product_id,
      name: row.name,
      brand: row.brand,
      price: row.price,
      image: row.image,
      description: row.description,
      category: row.category,
      family: row.family,
      intensity: row.intensity,
      scent: row.scent,
      volume: row.volume,
      rating: row.rating,
      reviews: row.reviews,
      inStock: row.inStock,
      isBestseller: row.isBestseller,
      volume_prices: row.volume_prices,
      sillage: row.sillage,
      longevity: row.longevity,
      projection: row.projection,
    } as any);
    return { ...decant, product };
  });
}

export async function upsertDecant(input: {
  productId: string;
  price1ml: number;
  price2ml: number;
  price5ml: number;
  price10ml: number;
  inStock1ml: boolean;
  inStock2ml: boolean;
  inStock5ml: boolean;
  inStock10ml: boolean;
  stock1ml?: number;
  stock2ml?: number;
  stock5ml?: number;
  stock10ml?: number;
}): Promise<Decant> {
  // Check if exists
  const existing = await getDecantByProductId(input.productId);
  const s1ml = input.stock1ml ?? 10;
  const s2ml = input.stock2ml ?? 10;
  const s5ml = input.stock5ml ?? 10;
  const s10ml = input.stock10ml ?? 10;

  if (existing) {
    await pool.query(
      `UPDATE decants SET 
        price_1ml = ?, price_2ml = ?, price_5ml = ?, price_10ml = ?,
        in_stock_1ml = ?, in_stock_2ml = ?, in_stock_5ml = ?, in_stock_10ml = ?,
        stock_1ml = ?, stock_2ml = ?, stock_5ml = ?, stock_10ml = ?
       WHERE product_id = ?`,
      [
        input.price1ml,
        input.price2ml,
        input.price5ml,
        input.price10ml,
        input.inStock1ml,
        input.inStock2ml,
        input.inStock5ml,
        input.inStock10ml,
        s1ml,
        s2ml,
        s5ml,
        s10ml,
        input.productId,
      ]
    );
    const updated = await getDecantByProductId(input.productId);
    if (!updated) throw new Error('Gagal memperbarui decant');
    return updated;
  } else {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO decants 
        (product_id, price_1ml, price_2ml, price_5ml, price_10ml, in_stock_1ml, in_stock_2ml, in_stock_5ml, in_stock_10ml, stock_1ml, stock_2ml, stock_5ml, stock_10ml)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.productId,
        input.price1ml,
        input.price2ml,
        input.price5ml,
        input.price10ml,
        input.inStock1ml,
        input.inStock2ml,
        input.inStock5ml,
        input.inStock10ml,
        s1ml,
        s2ml,
        s5ml,
        s10ml,
      ]
    );
    const created = await getDecantByProductId(input.productId);
    if (!created) throw new Error('Gagal membuat decant');
    return created;
  }
}

export async function deleteDecant(productId: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM decants WHERE product_id = ?',
    [productId]
  );
  return result.affectedRows > 0;
}
