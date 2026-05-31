import { NextResponse } from 'next/server';
import {
  deleteProduct,
  getProductByIdFromDb,
  getProductDbErrorMessage,
  normalizeProductInput,
  updateProduct,
} from '@/lib/product-db';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = await getProductByIdFromDb(id);

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const input = normalizeProductInput(body);

    if (!input.name) {
      return NextResponse.json(
        { error: 'Nama produk harus diisi' },
        { status: 400 }
      );
    }
    if (!input.brand) {
      return NextResponse.json({ error: 'Brand harus diisi' }, { status: 400 });
    }
    if (input.scent.length < 3) {
      return NextResponse.json(
        { error: 'Catatan aroma Top, Heart, dan Base wajib diisi' },
        { status: 400 }
      );
    }

    const existing = await getProductByIdFromDb(id);
    if (!existing) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    if (!input.image) {
      input.image = existing.image;
    }

    const product = await updateProduct(id, input);

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json(
      { error: getProductDbErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus produk' },
      { status: 500 }
    );
  }
}
