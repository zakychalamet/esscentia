import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from './db';
import type { JournalArticle } from './journal-articles';

interface JournalRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | string[] | null;
  category: string;
  published_date: string;
  read_time: string;
  image: string | null;
  author: string;
  is_featured: number | boolean;
}

export interface JournalInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
  image?: string;
  author: string;
  isFeatured?: boolean;
}

function parseContent(value: JournalRow['content']): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function rowToArticle(row: JournalRow): JournalArticle {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: parseContent(row.content),
    category: row.category,
    date: row.published_date,
    readTime: row.read_time,
    image:
      row.image ||
      'https://images.unsplash.com/photo-1541643600912-78b084683601?w=800&h=500&fit=crop',
    author: row.author,
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function getAllArticles(): Promise<JournalArticle[]> {
  const [rows] = await pool.query<JournalRow[]>(
    'SELECT * FROM journal_articles ORDER BY is_featured DESC, id DESC'
  );
  return rows.map(rowToArticle);
}

export async function getArticleBySlugFromDb(slug: string): Promise<JournalArticle | null> {
  const [rows] = await pool.query<JournalRow[]>(
    'SELECT * FROM journal_articles WHERE slug = ?',
    [slug]
  );
  if (!rows.length) return null;
  return rowToArticle(rows[0]);
}

export async function createArticle(input: JournalInput): Promise<JournalArticle> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO journal_articles
      (slug, title, excerpt, content, category, published_date, read_time, image, author, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.slug,
      input.title,
      input.excerpt,
      JSON.stringify(input.content),
      input.category,
      input.date,
      input.readTime,
      input.image || '',
      input.author,
      input.isFeatured ?? false,
    ]
  );

  const [rows] = await pool.query<JournalRow[]>(
    'SELECT * FROM journal_articles WHERE id = ?',
    [result.insertId]
  );
  if (!rows.length) throw new Error('Gagal membuat artikel');
  return rowToArticle(rows[0]);
}

export async function updateArticle(
  slug: string,
  input: JournalInput
): Promise<JournalArticle | null> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE journal_articles SET
      slug = ?, title = ?, excerpt = ?, content = ?, category = ?,
      published_date = ?, read_time = ?, image = ?, author = ?, is_featured = ?
     WHERE slug = ?`,
    [
      input.slug,
      input.title,
      input.excerpt,
      JSON.stringify(input.content),
      input.category,
      input.date,
      input.readTime,
      input.image || '',
      input.author,
      input.isFeatured ?? false,
      slug,
    ]
  );

  if (result.affectedRows === 0) return null;
  return getArticleBySlugFromDb(input.slug);
}

export async function deleteArticle(slug: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM journal_articles WHERE slug = ?',
    [slug]
  );
  return result.affectedRows > 0;
}

export function normalizeJournalInput(body: Record<string, unknown>): JournalInput {
  const content = Array.isArray(body.content)
    ? body.content.map((p) => String(p).trim()).filter(Boolean)
    : String(body.contentBody ?? body.content ?? '')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

  const title = String(body.title ?? '').trim();
  const slugRaw = String(body.slug ?? '').trim();

  return {
    slug: slugRaw || slugify(title),
    title,
    excerpt: String(body.excerpt ?? '').trim(),
    content,
    category: String(body.category ?? 'Edukasi').trim(),
    date: String(body.date ?? '').trim(),
    readTime: String(body.readTime ?? '5 menit').trim(),
    image: String(body.image ?? ''),
    author: String(body.author ?? 'Tim Esscentia').trim(),
    isFeatured: Boolean(body.isFeatured),
  };
}

export function estimateReadTime(content: string[]): string {
  const words = content.join(' ').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return minutes + ' menit';
}
