import 'server-only';
import { ERROR_MSG, verifyToken } from '@moneed/auth';
import { cookies } from 'next/headers';
import { ResponseError } from '@moneed/utils';
import { TokenPayload } from '@moneed/auth';

export function assertAccessTokenPayload(payload: TokenPayload | undefined): asserts payload is TokenPayload {
    if (!payload) {
        throw new ResponseError(401, ERROR_MSG.UNAUTHORIZED);
    }
}

export const getCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
};

/**
 * 쿠키에서 액세스 토큰을 추출합니다.
 */
async function getAccessTokenFromCookies(): Promise<string | undefined> {
    const cookieStore = await cookies();
    const tokenName = process.env.JWT_ACCESS_NAME || 'access_token';
    return cookieStore.get(tokenName)?.value;
}

/**
 * 액세스 토큰을 검증하고 페이로드를 반환합니다.
 */
async function validateAccessToken(accessToken: string): Promise<TokenPayload> {
    const secretKey = process.env.SESSION_SECRET || '';
    const accessTokenResult = await verifyToken({ jwt: accessToken, key: secretKey });

    if (accessTokenResult.isExpired) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_EXPIRED);
    }

    if (accessTokenResult.isInvalid) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_INVALID);
    }

    return accessTokenResult.payload as TokenPayload;
}

/**
 * 요청 쿠키를 검증하고 토큰 정보를 반환합니다.
 * 단일 책임: 전체 인증 플로우 조합 및 관리
 */
export async function verifyRequestCookies() {
    const accessToken = await getAccessTokenFromCookies();

    if (!accessToken) {
        return {
            accessToken: undefined,
            accessTokenPayload: undefined,
        };
    }

    const accessTokenPayload = await validateAccessToken(accessToken);

    return {
        accessToken: accessToken as string,
        accessTokenPayload,
    };
}

/**
 * 인증된 사용자 ID를 안전하게 가져옵니다.
 * 단일 책임: 선택적 사용자 인증 처리만 담당
 */
export async function getOptionalUserId(): Promise<string | undefined> {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();
        return accessTokenPayload?.userId;
    } catch {
        // 인증 실패 시 undefined 반환 (비로그인 사용자로 처리)
        return undefined;
    }
}
