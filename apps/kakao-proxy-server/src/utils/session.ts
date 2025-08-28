import { ERROR_MSG } from '@/constants/error';
import type { TokenPayload } from '@moneed/auth';
import { refreshTokenCookie, accessTokenCookie, verifySession } from '@moneed/auth';
import { Request, Response } from 'express';
import { ResponseError } from './error';

export async function deleteSession(response: Response) {
    response.clearCookie(accessTokenCookie.name);
    response.clearCookie(refreshTokenCookie.name);
}

export async function verifyRequestCookies(req: Request) {
    const accessToken = req.cookies[accessTokenCookie.name];
    const refreshToken = req.cookies[refreshTokenCookie.name];

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
