import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, segment, promoType, durationDays } = body;

    if (!title || !message || !segment) {
      return NextResponse.json({ error: 'Title, message, and segment are required' }, { status: 400 });
    }

    const parsedDuration = durationDays !== undefined ? parseInt(durationDays, 10) : 7;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO campaign_notifications (title, message, segment, promo_type, duration_days) VALUES (?, ?, ?, ?, ?)`,
      [title.trim(), message.trim(), segment, promoType || 'Private Collection Access', parsedDuration]
    );

    return NextResponse.json({
      success: true,
      campaign: {
        id: result.insertId,
        title,
        message,
        segment,
        promoType,
        durationDays: parsedDuration,
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
      `SELECT id, title, message, segment, promo_type as promoType, duration_days as durationDays, created_at as createdAt 
       FROM campaign_notifications ORDER BY id DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/admin/campaigns error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data kampanye' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM campaign_notifications WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Campaign cancelled successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/campaigns error:', error);
    return NextResponse.json({ error: 'Gagal membatalkan kampanye' }, { status: 500 });
  }
}

