import { NextResponse } from 'next/server';
import { createOrder, getOrdersByUserId } from '@/lib/order-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID dibutuhkan' }, { status: 400 });
    }

    const orders = await getOrdersByUserId(userId);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pesanan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.items?.length) {
      return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 });
    }

    const order = await createOrder({
      userId: body.userId ?? null,
      subtotal: Number(body.subtotal),
      shippingCost: Number(body.shippingCost),
      totalAmount: Number(body.totalAmount),
      shipMethod: String(body.shipMethod ?? 'regular'),
      paymentMethod: String(body.paymentMethod ?? 'transfer'),
      shippingName: String(body.shippingName ?? ''),
      shippingEmail: String(body.shippingEmail ?? ''),
      shippingPhone: String(body.shippingPhone ?? ''),
      shippingAddress: String(body.shippingAddress ?? ''),
      shippingCity: String(body.shippingCity ?? ''),
      shippingProvince: String(body.shippingProvince ?? ''),
      shippingPostalCode: String(body.shippingPostalCode ?? ''),
      notes: String(body.notes ?? ''),
      items: body.items.map((item: {
        productId: string;
        productName: string;
        quantity: number;
        price: number;
        isDecant?: boolean;
        selectedVolume?: number;
      }) => ({
        productId: String(item.productId),
        productName: String(item.productName),
        quantity: Number(item.quantity),
        price: Number(item.price),
        isDecant: item.isDecant !== undefined ? Boolean(item.isDecant) : undefined,
        selectedVolume: item.selectedVolume !== undefined ? Number(item.selectedVolume) : undefined,
      })),
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}

