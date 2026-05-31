import { NextResponse } from 'next/server';
import { createUser, ensureSeedUsers, findUserByEmail, toPublicUser } from '@/lib/user-db';

export async function POST(request: Request) {
  try {
    await ensureSeedUsers();
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '');

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const user = await createUser({ name, email, password, role: 'user' });
    return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json({ error: 'Gagal mendaftar' }, { status: 500 });
  }
}
