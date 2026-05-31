import { NextResponse } from 'next/server';
import { getCustomerDirectory } from '@/lib/customer-service';

export async function GET() {
  try {
    const customers = await getCustomerDirectory();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('GET /api/customers error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pelanggan' }, { status: 500 });
  }
}
