import 'server-only';
import { ERROR_MSG, verifyToken } from '@moneed/auth';
import { cookies } from 'next/headers';
import { ResponseError } from '@moneed/utils';
import { TokenPayload } from '@moneed/auth';

export const getServerSideCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
};

// refreshToken 은 proxy server 에서 검증
export async function verifyRequestCookies() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(process.env.JWT_ACCESS_NAME || 'access_token')?.value;

    if (!accessToken) {
        return {
            accessToken: undefined,
            accessTokenPayload: undefined,
        };
    }

    const accessTokenResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET || '' });
    if (accessTokenResult.isExpired) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_EXPIRED);
    }

    if (accessTokenResult.isInvalid) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_INVALID);
    }

    return {
        accessToken: accessToken as string,
        accessTokenPayload: accessTokenResult.payload as TokenPayload,
    };
}
