import { NextRequest, NextResponse } from 'next/server';
import { getAdminRfmAnalytics, saveRfmConfig } from '@/lib/customer-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rWeightStr = searchParams.get('rWeight');
    const fWeightStr = searchParams.get('fWeight');
    const mWeightStr = searchParams.get('mWeight');
    const kStr = searchParams.get('k');
    const maxIterStr = searchParams.get('maxIter');

    if (rWeightStr && fWeightStr && mWeightStr && kStr && maxIterStr) {
      const rWeight = Number(rWeightStr);
      const fWeight = Number(fWeightStr);
      const mWeight = Number(mWeightStr);
      const k = Number(kStr);
      const maxIter = Number(maxIterStr);

      await saveRfmConfig({
        recencyWeight: rWeight,
        frequencyWeight: fWeight,
        monetaryWeight: mWeight,
        k,
        maxIterations: maxIter,
      });

      const analytics = await getAdminRfmAnalytics(rWeight, fWeight, mWeight, k, maxIter);
      return NextResponse.json(analytics);
    }

    const analytics = await getAdminRfmAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('GET /api/admin/rfm error:', error);
    return NextResponse.json({ error: 'Gagal menghitung analitik RFM' }, { status: 500 });
  }
}
