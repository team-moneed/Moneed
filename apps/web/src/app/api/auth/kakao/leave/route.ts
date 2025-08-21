import { ERROR_MSG } from '@/constants/errorMsg';
import { getSession } from '@/lib/session';
import { KakaoAuthService } from '@/services/kakaoAuth.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { reason } = await request.json();

    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const kakaoAuthService = new KakaoAuthService();
        const result = await kakaoAuthService.leave({ userId: session.userId, reason });

        if (result.success) {
            return NextResponse.json({ message: result.message }, { status: result.status });
        } else {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }
    } catch (error) {
        console.error('Leave API error:', error);
        return NextResponse.json({ error: ERROR_MSG.KAKAO_INTERNAL_ERROR }, { status: 500 });
    }
}
