import { NextResponse } from 'next/server';
import { getAdminRfmAnalytics } from '@/lib/customer-service';

export async function GET() {
  try {
    const analytics = await getAdminRfmAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('GET /api/admin/rfm error:', error);
    return NextResponse.json({ error: 'Gagal menghitung analitik RFM' }, { status: 500 });
  }
}
