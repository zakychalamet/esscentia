import { NextResponse } from 'next/server';
import { getCustomerDetail } from '@/lib/customer-service';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const customer = await getCustomerDetail(id);

    if (!customer) {
      return NextResponse.json({ error: 'Pelanggan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('GET /api/customers/[id] error:', error);
    return NextResponse.json({ error: 'Gagal mengambil detail pelanggan' }, { status: 500 });
  }
}
