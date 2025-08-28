import 'server-only';
import { ERROR_MSG, TOKEN_KEY, verifySession } from '@moneed/auth';
import { cookies } from 'next/headers';
import { ResponseError } from '@moneed/utils';
import { TokenPayload } from '@moneed/auth';

export const getServerSideCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
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
