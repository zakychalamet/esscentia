import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserSegment } from '@/lib/customer-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let segment = 'all';
    if (userId) {
      segment = await getUserSegment(userId);
    }

    // Automatically clean up expired notifications from database
    await pool.query(
      `DELETE FROM campaign_notifications 
       WHERE duration_days IS NOT NULL 
         AND NOW() > DATE_ADD(created_at, INTERVAL duration_days DAY)`
    );

    // Query active notifications that are targeted to the user's specific segment or 'all'
    const [rows] = await pool.query(
      `SELECT id, title, message, segment, promo_type as promoType, duration_days as durationDays, created_at as createdAt 
       FROM campaign_notifications 
       WHERE segment = ? OR segment = 'all' 
       ORDER BY id DESC`,
      [segment]
    );

    return NextResponse.json({
      segment,
      notifications: rows,
    });
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json({ error: 'Gagal mengambil notifikasi' }, { status: 500 });
  }
}
