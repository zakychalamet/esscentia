import { NextResponse } from 'next/server';
import { getAllDecants, upsertDecant } from '@/lib/decant-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const decants = await getAllDecants();
    return NextResponse.json(decants);
  } catch (error) {
    console.error('GET /api/decants error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data decant' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productId,
      price1ml,
      price2ml,
      price5ml,
      price10ml,
      inStock1ml,
      inStock2ml,
      inStock5ml,
      inStock10ml,
      stock1ml,
      stock2ml,
      stock5ml,
      stock10ml,
    } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID wajib diisi' },
        { status: 400 }
      );
    }

    const decant = await upsertDecant({
      productId,
      price1ml: Number(price1ml || 0),
      price2ml: Number(price2ml || 0),
      price5ml: Number(price5ml || 0),
      price10ml: Number(price10ml || 0),
      inStock1ml: inStock1ml !== false,
      inStock2ml: inStock2ml !== false,
      inStock5ml: inStock5ml !== false,
      inStock10ml: inStock10ml !== false,
      stock1ml: stock1ml !== undefined ? Number(stock1ml) : 10,
      stock2ml: stock2ml !== undefined ? Number(stock2ml) : 10,
      stock5ml: stock5ml !== undefined ? Number(stock5ml) : 10,
      stock10ml: stock10ml !== undefined ? Number(stock10ml) : 10,
    });

    return NextResponse.json(decant, { status: 201 });
  } catch (error) {
    console.error('POST /api/decants error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan data decant' },
      { status: 500 }
    );
  }
}
