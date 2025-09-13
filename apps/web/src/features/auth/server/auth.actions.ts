'use server';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_NAME = process.env.JWT_ACCESS_NAME || 'access_token';
const REFRESH_TOKEN_NAME = process.env.JWT_REFRESH_NAME || 'refresh_token';

/**
 * 서버 액션: 토큰들을 쿠키에 저장
 */
export async function setTokensInCookies(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60, // 24시간
    });

    cookieStore.set(REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30일
    });
}

/**
 * 서버 액션: 쿠키에서 토큰들 삭제
 */
export async function clearTokensFromCookies() {
    const cookieStore = await cookies();

    cookieStore.delete(ACCESS_TOKEN_NAME);
    cookieStore.delete(REFRESH_TOKEN_NAME);
}

/**
 * 서버 액션: 액세스 토큰만 업데이트
 */
export async function updateAccessTokenInCookies(accessToken: string) {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60,
    });
}
