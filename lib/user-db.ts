import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from './db';
import { hashPassword, verifyPassword } from './password';
import type { UserRole } from './auth-context';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  loginCount: number;
  lastLoginAt: Date | null;
  createdAt: Date;
}

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string | null;
  login_count: number;
  last_login_at: Date | null;
  created_at: Date;
}

function rowToUser(row: UserRow): DbUser {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    role: row.role as UserRole,
    phone: row.phone,
    loginCount: row.login_count ?? 0,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
  };
}

export function toPublicUser(user: DbUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isAdmin: user.role === 'admin',
  };
}

export async function findUserByEmail(email: string): Promise<(DbUser & { password: string }) | null> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email.toLowerCase().trim()]
  );
  if (!rows.length) return null;
  const row = rows[0];
  return { ...rowToUser(row), password: row.password };
}

export async function findUserById(id: string): Promise<DbUser | null> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, name, email, role, phone, login_count, last_login_at, created_at FROM users WHERE id = ?',
    [id]
  );
  if (!rows.length) return null;
  return rowToUser(rows[0]);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<DbUser> {
  const hashed = hashPassword(input.password);
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [
      input.name.trim(),
      input.email.toLowerCase().trim(),
      hashed,
      input.role ?? 'user',
    ]
  );
  const user = await findUserById(String(result.insertId));
  if (!user) throw new Error('Gagal membuat user');
  return user;
}

export async function recordLogin(userId: string): Promise<DbUser | null> {
  await pool.query(
    `UPDATE users SET last_login_at = NOW(), login_count = login_count + 1 WHERE id = ?`,
    [userId]
  );
  return findUserById(userId);
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<DbUser | null> {
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password)) return null;
  return recordLogin(user.id);
}

export async function getCustomerUsers(): Promise<DbUser[]> {
  const [rows] = await pool.query<UserRow[]>(
    `SELECT id, name, email, role, phone, login_count, last_login_at, created_at
     FROM users WHERE role = 'user' ORDER BY COALESCE(last_login_at, created_at) DESC`
  );
  return rows.map(rowToUser);
}

export async function ensureSeedUsers(): Promise<void> {
  const seeds = [
    { name: 'Admin User', email: 'admin@esscentia.com', password: 'admin123', role: 'admin' as UserRole },
    { name: 'Marketing Admin', email: 'marketing@esscentia.com', password: 'marketing123', role: 'marketing' as UserRole },
  ];

  for (const seed of seeds) {
    const existing = await findUserByEmail(seed.email);
    if (!existing) {
      await createUser(seed);
    }
  }
}
