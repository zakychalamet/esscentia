import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from './db';

export interface OrderItemInput {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  isDecant?: boolean;
  selectedVolume?: number;
}

export interface CreateOrderInput {
  userId?: string | null;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  shipMethod: string;
  paymentMethod: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  notes?: string;
  items: OrderItemInput[];
}

export interface OrderRecord {
  id: string;
  userId: string | null;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: string;
  shipMethod: string;
  paymentMethod: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  notes: string;
  createdAt: Date;
  items: {
    id: string;
    productId: string | null;
    productName: string;
    quantity: number;
    price: number;
    productImage?: string | null;
  }[];
}

interface OrderRow extends RowDataPacket {
  id: number;
  user_id: number | null;
  order_number: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  status: string;
  ship_method: string;
  payment_method: string;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string | null;
  shipping_postal_code: string | null;
  notes: string | null;
  created_at: Date;
}

interface OrderItemRow extends RowDataPacket {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  price: number;
}

interface UserOrderStatsRow extends RowDataPacket {
  user_id: number;
  order_count: number;
  total_spend: number;
  last_order_at: Date | null;
}

function generateOrderNumber(): string {
  return `ORD-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRecord> {
  const orderNumber = generateOrderNumber();

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO orders
      (user_id, order_number, subtotal, shipping_cost, total_amount, status,
       ship_method, payment_method, shipping_name, shipping_email, shipping_phone,
       shipping_address, shipping_city, shipping_province, shipping_postal_code, notes)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.userId ?? null,
      orderNumber,
      input.subtotal,
      input.shippingCost,
      input.totalAmount,
      input.shipMethod,
      input.paymentMethod,
      input.shippingName,
      input.shippingEmail,
      input.shippingPhone,
      input.shippingAddress,
      input.shippingCity,
      input.shippingProvince ?? '',
      input.shippingPostalCode ?? '',
      input.notes ?? '',
    ]
  );

  const orderId = result.insertId;

  for (const item of input.items) {
    await pool.query(
      `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, item.productId || null, item.productName, item.quantity, item.price]
    );

    // Dynamic stock decrement based on product type
    if (item.productId) {
      let isDecant = item.isDecant;
      let selectedVolume = item.selectedVolume;

      // Fallback parsing from productName if explicit values are missing
      if (isDecant === undefined || selectedVolume === undefined) {
        const decantMatch = item.productName.match(/\(Decant\s+(\d+)ml\)/i);
        const bottleMatch = item.productName.match(/\((\d+)ml\)/i);
        if (decantMatch) {
          isDecant = true;
          selectedVolume = parseInt(decantMatch[1], 10);
        } else if (bottleMatch) {
          isDecant = false;
          selectedVolume = parseInt(bottleMatch[1], 10);
        }
      }

      if (isDecant) {
        const volKey = `${selectedVolume}ml`;
        if (['1ml', '2ml', '5ml', '10ml'].includes(volKey)) {
          const stockCol = `stock_${volKey}`;
          const instockCol = `in_stock_${volKey}`;

          // Decrement stock (ensure cast to signed to prevent unsigned overflow warnings if any)
          await pool.query(
            `UPDATE decants 
             SET ${stockCol} = GREATEST(0, CAST(${stockCol} AS SIGNED) - ?) 
             WHERE product_id = ?`,
            [item.quantity, item.productId]
          );

          // Mark out-of-stock if stock reaches 0
          await pool.query(
            `UPDATE decants 
             SET ${instockCol} = false 
             WHERE product_id = ? AND ${stockCol} = 0`,
            [item.productId]
          );
        }
      } else {
        // Decrement product stock
        await pool.query(
          `UPDATE products 
           SET stock = GREATEST(0, CAST(stock AS SIGNED) - ?) 
           WHERE id = ?`,
          [item.quantity, item.productId]
        );

        // Mark out-of-stock if stock reaches 0
        await pool.query(
          `UPDATE products 
           SET inStock = false 
           WHERE id = ? AND stock = 0`,
          [item.productId]
        );
      }
    }
  }

  const order = await getOrderById(String(orderId));
  if (!order) throw new Error('Gagal membuat pesanan');
  return order;
}

async function getOrderItems(orderId: number) {
  const [rows] = await pool.query<any[]>(
    `SELECT oi.*, p.image AS product_image 
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ? 
     ORDER BY oi.id`,
    [orderId]
  );
  return rows.map((row) => ({
    id: String(row.id),
    productId: row.product_id ? String(row.product_id) : null,
    productName: row.product_name,
    quantity: row.quantity,
    price: Number(row.price),
    productImage: row.product_image || null,
  }));
}

function mapOrder(row: OrderRow, items: OrderRecord['items']): OrderRecord {
  return {
    id: String(row.id),
    userId: row.user_id ? String(row.user_id) : null,
    orderNumber: row.order_number,
    subtotal: Number(row.subtotal),
    shippingCost: Number(row.shipping_cost),
    totalAmount: Number(row.total_amount),
    status: row.status,
    shipMethod: row.ship_method,
    paymentMethod: row.payment_method,
    shippingName: row.shipping_name,
    shippingEmail: row.shipping_email,
    shippingPhone: row.shipping_phone,
    shippingAddress: row.shipping_address,
    shippingCity: row.shipping_city,
    shippingProvince: row.shipping_province ?? '',
    shippingPostalCode: row.shipping_postal_code ?? '',
    notes: row.notes ?? '',
    createdAt: row.created_at,
    items,
  };
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const [rows] = await pool.query<OrderRow[]>('SELECT * FROM orders WHERE id = ?', [id]);
  if (!rows.length) return null;
  const items = await getOrderItems(rows[0].id);
  return mapOrder(rows[0], items);
}

export async function getOrdersByUserId(userId: string): Promise<OrderRecord[]> {
  const [rows] = await pool.query<OrderRow[]>(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  const orders: OrderRecord[] = [];
  for (const row of rows) {
    const items = await getOrderItems(row.id);
    orders.push(mapOrder(row, items));
  }
  return orders;
}

export async function getUserOrderStats(): Promise<
  Map<string, { orderCount: number; totalSpend: number; lastOrderAt: Date | null }>
> {
  const [rows] = await pool.query<UserOrderStatsRow[]>(
    `SELECT user_id,
            COUNT(*) AS order_count,
            COALESCE(SUM(total_amount), 0) AS total_spend,
            MAX(created_at) AS last_order_at
     FROM orders
     WHERE user_id IS NOT NULL AND status = 'completed'
     GROUP BY user_id`
  );

  const map = new Map<string, { orderCount: number; totalSpend: number; lastOrderAt: Date | null }>();
  for (const row of rows) {
    map.set(String(row.user_id), {
      orderCount: Number(row.order_count),
      totalSpend: Number(row.total_spend),
      lastOrderAt: row.last_order_at,
    });
  }
  return map;
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  const [rows] = await pool.query<OrderRow[]>(
    'SELECT * FROM orders ORDER BY created_at DESC'
  );
  const orders: OrderRecord[] = [];
  for (const row of rows) {
    const items = await getOrderItems(row.id);
    orders.push(mapOrder(row, items));
  }
  return orders;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, orderId]
  );
  return result.affectedRows > 0;
}

