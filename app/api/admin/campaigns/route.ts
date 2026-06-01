import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, segment, promoType } = body;

    if (!title || !message || !segment) {
      return NextResponse.json({ error: 'Title, message, and segment are required' }, { status: 400 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO campaign_notifications (title, message, segment, promo_type) VALUES (?, ?, ?, ?)`,
      [title.trim(), message.trim(), segment, promoType || 'Private Collection Access']
    );

    return NextResponse.json({
      success: true,
      campaign: {
        id: result.insertId,
        title,
        message,
        segment,
        promoType,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/campaigns error:', error);
    return NextResponse.json({ error: 'Gagal membuat kampanye promosi' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, message, segment, promo_type as promoType, created_at as createdAt 
       FROM campaign_notifications ORDER BY id DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/admin/campaigns error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data kampanye' }, { status: 500 });
  }
}
