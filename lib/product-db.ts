import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from './db';
import type { Product } from './products';

interface ProductRow extends RowDataPacket {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string | null;
  description: string | null;
  category: string;
  family: string;
  intensity: string;
  scent: string | string[] | null;
  volume: number;
  rating: number;
  reviews: number;
  inStock: number | boolean;
  stock: number;
  isBestseller: number | boolean;
  volume_prices: string | { volume: number; price: number }[] | null;
  sillage: string | null;
  projection: string | null;
  longevity: string | null;
}

export interface ProductInput {
  name: string;
  brand: string;
  price: number;
  category: Product['category'];
  family: Product['family'];
  intensity: Product['intensity'];
  volume: number;
  rating?: number;
  reviews?: number;
  image?: string;
  description?: string;
  inStock?: boolean;
  stock?: number;
  isBestseller?: boolean;
  scent: string[];
  volume_prices: { volume: number; price: number }[];
  sillage?: string;
  projection?: string;
  longevity?: string;
}

function parseScent(value: ProductRow['scent']): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseVolumePrices(value: ProductRow['volume_prices']): { volume: number; price: number }[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value as string);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: String(row.id),
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    image:
      row.image ||
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',
    description: row.description || '',
    category: row.category as Product['category'],
    family: row.family as Product['family'],
    intensity: row.intensity as Product['intensity'],
    scent: parseScent(row.scent),
    volume: row.volume,
    rating: Number(row.rating) || 5,
    reviews: row.reviews || 0,
    inStock: Boolean(row.inStock),
    stock: Number(row.stock) || 0,
    isBestseller: Boolean(row.isBestseller),
    volume_prices: parseVolumePrices(row.volume_prices),
    sillage: row.sillage || '',
    projection: row.projection || '',
    longevity: row.longevity || '',
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const [rows] = await pool.query<ProductRow[]>(
    'SELECT * FROM products ORDER BY id DESC'
  );
  return rows.map(rowToProduct);
}

export async function getProductByIdFromDb(id: string): Promise<Product | null> {
  const [rows] = await pool.query<ProductRow[]>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );
  if (!rows.length) return null;
  return rowToProduct(rows[0]);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO products
      (name, brand, price, image, description, category, family, intensity, scent, volume, rating, reviews, inStock, stock, isBestseller, volume_prices, sillage, projection, longevity)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.brand,
      input.price,
      input.image || '',
      input.description || '',
      input.category,
      input.family,
      input.intensity,
      JSON.stringify(input.scent || []),
      input.volume,
      input.rating ?? 5,
      input.reviews ?? 0,
      input.inStock ?? true,
      input.stock ?? 10,
      input.isBestseller ?? false,
      JSON.stringify(input.volume_prices || []),
      input.sillage || '',
      input.projection || '',
      input.longevity || '',
    ]
  );

  const product = await getProductByIdFromDb(String(result.insertId));
  if (!product) throw new Error('Gagal membuat produk');
  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product | null> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE products SET
      name = ?, brand = ?, price = ?, image = ?, description = ?,
      category = ?, family = ?, intensity = ?, scent = ?, volume = ?,
      rating = ?, reviews = ?, inStock = ?, stock = ?, isBestseller = ?, volume_prices = ?,
      sillage = ?, projection = ?, longevity = ?
     WHERE id = ?`,
    [
      input.name,
      input.brand,
      input.price,
      input.image || '',
      input.description || '',
      input.category,
      input.family,
      input.intensity,
      JSON.stringify(input.scent || []),
      input.volume,
      input.rating ?? 5,
      input.reviews ?? 0,
      input.inStock ?? true,
      input.stock ?? 10,
      input.isBestseller ?? false,
      JSON.stringify(input.volume_prices || []),
      input.sillage || '',
      input.projection || '',
      input.longevity || '',
      id,
    ]
  );

  if (result.affectedRows === 0) return null;
  return getProductByIdFromDb(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM products WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

export function getProductDbErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'Gagal menyimpan produk';
  const msg = error.message;
  if (msg.includes('Data too long for column')) {
    if (msg.includes("'image'")) {
      return 'URL gambar terlalu panjang. Gunakan link pendek (mis. Unsplash) atau kosongkan field foto.';
    }
    return 'Data terlalu panjang untuk salah satu field.';
  }
  if (msg.includes('ECONNREFUSED') || msg.includes('connect')) {
    return 'Tidak dapat terhubung ke database MySQL. Pastikan Laragon/MySQL sedang berjalan.';
  }
  return msg || 'Gagal menyimpan produk';
}

export function normalizeProductInput(body: Record<string, unknown>): ProductInput {
  const num = (value: unknown, fallback = 0) => {
    if (value === '' || value === null || value === undefined) return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const volumePrices = Array.isArray(body.volume_prices) 
    ? body.volume_prices.map((item: any) => ({
        volume: Number(item.volume || 0),
        price: Number(item.price || 0)
      }))
    : [];

  return {
    name: String(body.name ?? '').trim(),
    brand: String(body.brand ?? '').trim(),
    price: num(body.price),
    category: (body.category as Product['category']) || 'unisex',
    family: (body.family as Product['family']) || 'Woody',
    intensity: (body.intensity as Product['intensity']) || 'EDP',
    volume: num(body.volume, 50),
    rating: num(body.rating ?? 5),
    reviews: num(body.reviews ?? 0),
    image: String(body.image ?? ''),
    description: String(body.description ?? ''),
    inStock: body.inStock !== false && body.inStock !== 0,
    stock: num(body.stock, 10),
    isBestseller: Boolean(body.isBestseller),
    scent: normalizeScent(body),
    volume_prices: volumePrices,
    sillage: String(body.sillage ?? '').trim(),
    projection: String(body.projection ?? '').trim(),
    longevity: String(body.longevity ?? '').trim(),
  };
}

function normalizeScent(body: Record<string, unknown>): string[] {
  if (Array.isArray(body.scent)) {
    return body.scent
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  const fromNotes = ['noteTop', 'noteHeart', 'noteBase']
    .map((key) => String(body[key] ?? '').trim())
    .filter(Boolean);

  return fromNotes;
}
