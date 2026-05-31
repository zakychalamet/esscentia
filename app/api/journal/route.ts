import { NextResponse } from 'next/server';
import {
  createArticle,
  estimateReadTime,
  getAllArticles,
  normalizeJournalInput,
} from '@/lib/journal-db';

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('GET /api/journal error:', error);
    return NextResponse.json({ error: 'Gagal mengambil artikel' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = normalizeJournalInput(body);

    if (!input.title) {
      return NextResponse.json({ error: 'Judul artikel wajib diisi' }, { status: 400 });
    }
    if (!input.excerpt) {
      return NextResponse.json({ error: 'Ringkasan artikel wajib diisi' }, { status: 400 });
    }
    if (!input.content.length) {
      return NextResponse.json({ error: 'Isi artikel wajib diisi' }, { status: 400 });
    }
    if (!input.date) {
      input.date = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (!input.readTime) {
      input.readTime = estimateReadTime(input.content);
    }

    const article = await createArticle(input);
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('POST /api/journal error:', error);
    const message =
      error instanceof Error && error.message.includes('Duplicate')
        ? 'Slug artikel sudah digunakan'
        : 'Gagal menambahkan artikel';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
