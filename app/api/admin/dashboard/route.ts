import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Revenue Metrics
    const [totalRes] = await pool.query<any[]>(
      `SELECT COALESCE(SUM(total_amount), 0) AS val FROM orders WHERE status NOT IN ('cancelled', 'canceled')`
    );
    const [dailyRes] = await pool.query<any[]>(
      `SELECT COALESCE(SUM(total_amount), 0) AS val FROM orders WHERE status NOT IN ('cancelled', 'canceled') AND DATE(created_at) = CURDATE()`
    );
    const [weeklyRes] = await pool.query<any[]>(
      `SELECT COALESCE(SUM(total_amount), 0) AS val FROM orders WHERE status NOT IN ('cancelled', 'canceled') AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
    );
    const [monthlyRes] = await pool.query<any[]>(
      `SELECT COALESCE(SUM(total_amount), 0) AS val FROM orders WHERE status NOT IN ('cancelled', 'canceled') AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    const revenue = {
      total: Number(totalRes[0]?.val || 0),
      daily: Number(dailyRes[0]?.val || 0),
      weekly: Number(weeklyRes[0]?.val || 0),
      monthly: Number(monthlyRes[0]?.val || 0),
    };

    // 2. Top Selling Products
    const [topProducts] = await pool.query<any[]>(
      `SELECT oi.product_id AS id, oi.product_name AS name, SUM(oi.quantity) AS qty, SUM(oi.quantity * oi.price) AS revenue, MAX(p.image) AS image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY oi.product_id, oi.product_name
       ORDER BY qty DESC
       LIMIT 5`
    );

    const topSelling = topProducts.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      qty: Number(row.qty || 0),
      revenue: Number(row.revenue || 0),
      image: row.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',
    }));

    // 3. Sales Time-series (Last 30 Days)
    const [seriesRes] = await pool.query<any[]>(
      `SELECT DATE(created_at) AS date, COALESCE(SUM(total_amount), 0) AS revenue, COUNT(*) AS count
       FROM orders
       WHERE status NOT IN ('cancelled', 'canceled') AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    // Fill in dates for past 30 days
    const timeSeriesMap = new Map<string, { revenue: number; count: number }>();
    seriesRes.forEach((row) => {
      const dateStr = new Date(row.date).toISOString().split('T')[0];
      timeSeriesMap.set(dateStr, {
        revenue: Number(row.revenue || 0),
        count: Number(row.count || 0),
      });
    });

    const timeSeries = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = timeSeriesMap.get(dateStr);
      timeSeries.push({
        date: dateStr,
        formattedDate: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        revenue: match?.revenue ?? 0,
        count: match?.count ?? 0,
      });
    }

    // 4. Low Stock Alerts
    // Perfumes
    const [lowProducts] = await pool.query<any[]>(
      `SELECT id, name, brand, stock, image
       FROM products
       WHERE stock <= 5
       ORDER BY stock ASC
       LIMIT 5`
    );

    // Decants
    const [lowDecants] = await pool.query<any[]>(
      `SELECT d.product_id AS id, p.name, p.brand, p.image, d.stock_1ml, d.stock_2ml, d.stock_5ml, d.stock_10ml
       FROM decants d
       JOIN products p ON d.product_id = p.id
       WHERE d.stock_1ml <= 5 OR d.stock_2ml <= 5 OR d.stock_5ml <= 5 OR d.stock_10ml <= 5
       ORDER BY LEAST(d.stock_1ml, d.stock_2ml, d.stock_5ml, d.stock_10ml) ASC
       LIMIT 5`
    );

    const alerts = {
      perfumes: lowProducts.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        brand: String(row.brand),
        stock: Number(row.stock),
        image: row.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',
      })),
      decants: lowDecants.map((row) => {
        const sizes = [];
        if (Number(row.stock_1ml) <= 5) sizes.push(`1ml (${row.stock_1ml})`);
        if (Number(row.stock_2ml) <= 5) sizes.push(`2ml (${row.stock_2ml})`);
        if (Number(row.stock_5ml) <= 5) sizes.push(`5ml (${row.stock_5ml})`);
        if (Number(row.stock_10ml) <= 5) sizes.push(`10ml (${row.stock_10ml})`);
        
        return {
          id: String(row.id),
          name: String(row.name),
          brand: String(row.brand),
          image: row.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',
          lowSizes: sizes.join(', '),
        };
      }),
    };

    return NextResponse.json({
      revenue,
      topSelling,
      timeSeries,
      alerts,
    });
  } catch (error) {
    console.error('GET /api/admin/dashboard error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data dashboard' }, { status: 500 });
  }
}
