import { ERROR_MSG } from '@/constants/error';
import type { TokenPayload } from '@moneed/auth';
import { verifyToken } from '@moneed/auth';
import { Request, Response } from 'express';
import { ResponseError } from '@moneed/utils';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/token';

export async function deleteSession(response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE.name);
    response.clearCookie(REFRESH_TOKEN_COOKIE.name);
}

export async function verifyRequestCookies(req: Request) {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE.name];
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE.name];

    const key = process.env.SESSION_SECRET;
    if (!key) {
        console.error(ERROR_MSG.SESSION_SECRET_NOT_SET);
        throw new ResponseError(500, ERROR_MSG.SESSION_SECRET_NOT_SET);
    }

    const accessTokenResult = await verifyToken({ jwt: accessToken, key });
    if (accessTokenResult.isExpired) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_EXPIRED);
    }

    if (accessTokenResult.isInvalid) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_INVALID);
    }

    const refreshTokenResult = await verifyToken({ jwt: refreshToken, key });
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
