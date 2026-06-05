import { NextResponse } from 'next/server';
import { getDecantByProductId, deleteDecant } from '@/lib/decant-db';

type RouteContext = { params: Promise<{ productId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { productId } = await context.params;
    const decant = await getDecantByProductId(productId);
    if (!decant) {
      return NextResponse.json({ error: 'Decant tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(decant);
  } catch (error) {
    console.error('GET /api/decants/[productId] error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data decant' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { productId } = await context.params;
    const deleted = await deleteDecant(productId);
    if (!deleted) {
      return NextResponse.json({ error: 'Decant tidak ditemukan atau gagal dihapus' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/decants/[productId] error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data decant' },
      { status: 500 }
    );
  }
}
