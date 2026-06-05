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

  // Try to upload to remote host (Catbox.moe) first for permanent public hosting
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file);

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(10000) // 10s timeout
    });

    if (response.ok) {
      const remoteUrl = await response.text();
      if (remoteUrl && remoteUrl.startsWith('https://')) {
        console.log('Successfully uploaded image remotely to Catbox:', remoteUrl);
        return remoteUrl.trim();
      }
    }
  } catch (error) {
    console.warn('Failed to upload image remotely, falling back to local storage:', error);
  }

  // Fallback to local filesystem storage
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

  return `/uploads/products/${filename}`;
}
