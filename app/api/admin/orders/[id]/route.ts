import { NextResponse } from 'next/server';
import { updateOrderStatus, getOrderById } from '@/lib/order-db';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('GET /api/admin/orders/[id] error:', error);
    return NextResponse.json({ error: 'Gagal mengambil rincian pesanan' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: 'Status harus diisi' }, { status: 400 });
    }

    const { id } = await context.params;
    const success = await updateOrderStatus(id, status);

    if (!success) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan atau gagal diupdate' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status pesanan berhasil diperbarui', success: true });
  } catch (error) {
    console.error('PUT /api/admin/orders/[id] error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status pesanan' }, { status: 500 });
  }
}
