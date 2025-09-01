import 'server-only';
import { ERROR_MSG, verifyToken } from '@moneed/auth';
import { cookies } from 'next/headers';
import { ResponseError } from '@moneed/utils';
import { TokenPayload } from '@moneed/auth';

export const getServerSideCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
};

export async function verifyRequestCookies() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(process.env.JWT_ACCESS_NAME || 'access_token')?.value;
    const refreshToken = cookieStore.get(process.env.JWT_REFRESH_NAME || 'refresh_token')?.value;

    const accessTokenResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET });
    if (accessTokenResult.isExpired) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_EXPIRED);
    }

    if (accessTokenResult.isInvalid) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_INVALID);
    }

    const refreshTokenResult = await verifyToken({ jwt: refreshToken, key: process.env.SESSION_SECRET });
    if (refreshTokenResult.isExpired) {
        throw new ResponseError(403, ERROR_MSG.REFRESH_TOKEN_EXPIRED);
    }

    if (refreshTokenResult.isInvalid) {
        throw new ResponseError(403, ERROR_MSG.REFRESH_TOKEN_INVALID);
    }

    return {
        accessToken: accessToken as string,
        refreshToken: refreshToken as string,
        accessTokenPayload: accessTokenResult.payload as TokenPayload,
        refreshTokenPayload: refreshTokenResult.payload as TokenPayload,
    };
}
