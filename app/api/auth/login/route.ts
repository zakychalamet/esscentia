import { NextResponse } from 'next/server';
import { authenticateUser, createUser, ensureSeedUsers, toPublicUser } from '@/lib/user-db';

export async function POST(request: Request) {
  try {
    await ensureSeedUsers();
    const body = await request.json();
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password harus diisi' }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Email atau password tidak sesuai' }, { status: 401 });
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ error: 'Gagal login' }, { status: 500 });
  }
}
