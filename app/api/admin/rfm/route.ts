import { NextRequest, NextResponse } from 'next/server';
import { getAdminRfmAnalytics } from '@/lib/customer-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rWeight = Number(searchParams.get('rWeight') ?? '40');
    const fWeight = Number(searchParams.get('fWeight') ?? '30');
    const mWeight = Number(searchParams.get('mWeight') ?? '30');
    const k = Number(searchParams.get('k') ?? '4');
    const maxIter = Number(searchParams.get('maxIter') ?? '300');

    const analytics = await getAdminRfmAnalytics(rWeight, fWeight, mWeight, k, maxIter);
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('GET /api/admin/rfm error:', error);
    return NextResponse.json({ error: 'Gagal menghitung analitik RFM' }, { status: 500 });
  }
}
