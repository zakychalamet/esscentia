import { NextResponse } from 'next/server';
import {
  createProduct,
  getAllProducts,
  getProductDbErrorMessage,
  normalizeProductInput,
} from '@/lib/product-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
    if (input.price < 0) {
      return NextResponse.json({ error: 'Harga tidak valid' }, { status: 400 });
    }
    if (input.volume < 0) {
      return NextResponse.json({ error: 'Volume tidak valid' }, { status: 400 });
    }
    if (!input.image) {
      return NextResponse.json({ error: 'Gambar produk wajib diunggah' }, { status: 400 });
    }
    if (input.scent.length < 3) {
      return NextResponse.json(
        { error: 'Catatan aroma Top, Heart, dan Base wajib diisi' },
        { status: 400 }
      );
    }

    const product = await createProduct(input);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { error: getProductDbErrorMessage(error) },
      { status: 500 }
    );
  }
}
