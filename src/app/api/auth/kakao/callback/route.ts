import { AUTH_ERROR_PATHS } from '@/constants/errorMsg';
import { KakaoAuthService } from '@/services/kakaoAuth.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error || errorDescription) {
        return NextResponse.redirect(
            new URL(`/auth/error?error=${error}&description=${errorDescription}`, request.url),
        );
    }

    if (!code) {
        return NextResponse.redirect(new URL(AUTH_ERROR_PATHS.MISSING_CODE, request.url));
    }

    if (!state || state !== process.env.KAKAO_STATE_TOKEN) {
        return NextResponse.redirect(new URL(AUTH_ERROR_PATHS.INVALID_STATE, request.url));
    }

    const kakaoAuthService = new KakaoAuthService();
    const result = await kakaoAuthService.login({ code });

    if (result.success) {
        return NextResponse.redirect(new URL('/', request.url));
    } else {
        return NextResponse.redirect(new URL(`/auth/error?error=${result.error}`, request.url));
    }
}
