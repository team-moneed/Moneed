import 'server-only';
import { ERROR_MSG, SessionResult, verifyToken } from '@moneed/auth';
import { cookies } from 'next/headers';
import { TOKEN_KEY } from '../config';

export const getCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
};

export const deleteCookie = async (key: string) => {
    const cookieStore = await cookies();
    cookieStore.delete(key);
};

export const clearCookie = async () => {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_KEY.ACCESS_TOKEN);
    cookieStore.delete(TOKEN_KEY.REFRESH_TOKEN);
};

/**
 * 요청 쿠키를 검증하고 토큰 정보를 반환합니다.
 * 단일 책임: 전체 인증 플로우 조합 및 관리
 */
export async function verifyRequestCookies(): Promise<SessionResult> {
    const accessToken = await getCookie(TOKEN_KEY.ACCESS_TOKEN);

    if (!accessToken) {
        return {
            data: null,
            error: new Error(ERROR_MSG.NO_ACCESS_TOKEN),
        };
    }

    return await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
}
