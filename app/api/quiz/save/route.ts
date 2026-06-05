import { NextResponse } from 'next/server';
import { findUserById, updateUserQuizResult, toPublicUser } from '@/lib/user-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, quizResult } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify user exists
    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Update quiz result
    const updated = await updateUserQuizResult(userId, quizResult || null);
    if (!updated) {
      return NextResponse.json({ error: 'Gagal menyimpan hasil kuis' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: toPublicUser(updated),
    });
  } catch (error) {
    console.error('POST /api/quiz/save error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan hasil kuis' }, { status: 500 });
  }
}
