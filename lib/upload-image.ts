import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function saveProductImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.');
  }

  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran gambar maksimal 5 MB.');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
  const filename = `${Date.now()}-${randomBytes(6).toString('hex')}.${safeExt}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

  return `/uploads/products/${filename}`;
}
