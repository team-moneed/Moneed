import 'server-only';
import { ERROR_MSG, SessionResult, verifyToken } from '@moneed/auth';
import { cookies } from 'next/headers';

export const getCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
};

/**
 * 요청 쿠키를 검증하고 토큰 정보를 반환합니다.
 * 단일 책임: 전체 인증 플로우 조합 및 관리
 */
export async function verifyRequestCookies(): Promise<SessionResult> {
    const accessToken = await getCookie(process.env.JWT_ACCESS_NAME || 'access_token');

    if (!accessToken) {
        return {
            data: null,
            error: new Error(ERROR_MSG.NO_ACCESS_TOKEN),
        };
    }

    return await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
}
