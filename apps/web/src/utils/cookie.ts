import { ERROR_MSG, TOKEN_KEY, verifySession, type DecodedToken } from '@moneed/auth';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';
import { ResponseError } from '@moneed/utils';
import { TokenPayload } from '@moneed/auth';

export const getServerSideCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
};

export const getCookie = (key: string) => {
    const cookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(`${key}=`))
        ?.split('=')[1];
    return cookie;
};

export const decodeToken = (token?: string): DecodedToken | null => {
    const accessToken = token || getCookie('access_token');
    if (!accessToken) return null;

    return decodeJwt<DecodedToken>(accessToken);
};

export const isTokenExpired = (token?: string): boolean => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return true;

    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
};

export async function verifyRequestCookies() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_KEY.ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(TOKEN_KEY.REFRESH_TOKEN)?.value;

    const accessTokenResult = await verifySession(accessToken);
    if (accessTokenResult.isExpired) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_EXPIRED);
    }

    if (accessTokenResult.isInvalid) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_INVALID);
    }

    const refreshTokenResult = await verifySession(refreshToken);
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
