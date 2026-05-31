import { NextResponse } from 'next/server';
import {
  deleteArticle,
  getArticleBySlugFromDb,
  normalizeJournalInput,
  updateArticle,
} from '@/lib/journal-db';

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const article = await getArticleBySlugFromDb(slug);

    if (!article) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('GET /api/journal/[slug] error:', error);
    return NextResponse.json({ error: 'Gagal mengambil artikel' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const input = normalizeJournalInput(body);

    if (!input.title) {
      return NextResponse.json({ error: 'Judul artikel wajib diisi' }, { status: 400 });
    }

    const existing = await getArticleBySlugFromDb(slug);
    if (!existing) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    if (!input.image) {
      input.image = existing.image;
    }

    const article = await updateArticle(slug, input);
    return NextResponse.json(article);
  } catch (error) {
    console.error('PUT /api/journal/[slug] error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui artikel' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const deleted = await deleteArticle(slug);

    if (!deleted) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/journal/[slug] error:', error);
    return NextResponse.json({ error: 'Gagal menghapus artikel' }, { status: 500 });
  }
}
