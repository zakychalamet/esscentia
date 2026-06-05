import { NextResponse } from 'next/server';
import { findUserById, updateUserProfile, toPublicUser } from '@/lib/user-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, image } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });
    }

    // Verify user exists
    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Update profile
    const updated = await updateUserProfile(userId, name, image || null);
    if (!updated) {
      return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: toPublicUser(updated),
    });
  } catch (error) {
    console.error('POST /api/auth/update-profile error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
