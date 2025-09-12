'use server';

import { cookies } from 'next/headers';

const ACCESS_TOKEN_NAME = process.env.JWT_ACCESS_NAME || 'access_token';
const REFRESH_TOKEN_NAME = process.env.JWT_REFRESH_NAME || 'refresh_token';

/**
 * 서버 액션: 토큰들을 쿠키에 저장
 */
export async function setTokensInCookies(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    // 액세스 토큰 쿠키 설정 (HttpOnly: false - 클라이언트에서도 읽기 가능)
    cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: false, // 클라이언트에서도 접근 가능
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60, // 24시간
    });

    // 리프레쉬 토큰 쿠키 설정 (HttpOnly: true - 서버에서만 접근)
    cookieStore.set(REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true, // 보안상 서버에서만 접근
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
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60,
    });
}
