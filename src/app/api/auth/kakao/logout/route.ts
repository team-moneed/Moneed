import { getSession } from '@/lib/session';
import { KakaoAuthService } from '@/services/kakaoAuth.service';
import { NextResponse } from 'next/server';

export async function POST() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: '로그아웃 성공' }, { status: 200 });
    }

    const kakaoAuthService = new KakaoAuthService();
    const result = await kakaoAuthService.logout(session.userId);
    if (result.success) {
        return NextResponse.json({ message: result.message }, { status: result.status });
    } else {
        return NextResponse.json({ message: result.error }, { status: result.status });
    }
}
