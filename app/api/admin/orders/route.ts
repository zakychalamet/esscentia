import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/order-db';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/admin/orders error:', error);
    return NextResponse.json({ error: 'Gagal mengambil seluruh data pesanan' }, { status: 500 });
  }
}
