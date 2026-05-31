import { NextResponse } from 'next/server';
import { saveProductImage } from '@/lib/upload-image';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'File gambar wajib diunggah' }, { status: 400 });
    }

    const url = await saveProductImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    const message =
      error instanceof Error ? error.message : 'Gagal mengunggah gambar';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
