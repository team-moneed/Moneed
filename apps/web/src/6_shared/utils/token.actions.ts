'use server';
import { cookies } from 'next/headers';
import { TOKEN_KEY } from '@/6_shared/config';

/**
 * 서버 액션: 토큰들을 쿠키에 저장
 */
export async function setTokensInCookies(accessToken: string, refreshToken: string) {
    try {
        const cookieStore = await cookies();

        cookieStore.set(TOKEN_KEY.ACCESS_TOKEN, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60, // 24시간
        });

        cookieStore.set(TOKEN_KEY.REFRESH_TOKEN, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30일
        });
    } catch (error) {
        console.warn('쿠키 저장 실패:', error);
    }
}

/**
 * 서버 액션: 쿠키에서 토큰들 삭제
 */
export async function clearTokensFromCookies() {
    try {
        const cookieStore = await cookies();

        cookieStore.delete(TOKEN_KEY.ACCESS_TOKEN);
        cookieStore.delete(TOKEN_KEY.REFRESH_TOKEN);
    } catch (error) {
        console.warn('쿠키 삭제 실패:', error);
    }
}

/**
 * 서버 액션: 액세스 토큰만 업데이트
 */
export async function updateAccessTokenInCookies(accessToken: string) {
    try {
        const cookieStore = await cookies();

        cookieStore.set(TOKEN_KEY.ACCESS_TOKEN, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60,
        });
    } catch (error) {
        console.warn('쿠키 업데이트 실패:', error);
    }
}
