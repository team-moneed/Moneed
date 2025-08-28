import { ERROR_MSG } from '@/constants/error';
import type { TokenPayload } from '@moneed/auth';
import { decrypt, encrypt, refreshTokenCookie, accessTokenCookie } from '@moneed/auth';
import { Request, Response } from 'express';
import { JWSInvalid, JWTExpired, JWTInvalid } from 'jose/errors';
import { ResponseError } from './error';

export async function createSession(payload: TokenPayload): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpire: Date;
    refreshTokenExpire: Date;
}> {
    if (!process.env.SESSION_SECRET) {
        throw new Error(ERROR_MSG.SESSION_SECRET_NOT_SET);
    }

    const expires = {
        access: new Date(Date.now() + accessTokenCookie.duration),
        refresh: new Date(Date.now() + refreshTokenCookie.duration),
    };

    const [accessToken, refreshToken] = await Promise.all([
        encrypt(payload, expires.access, process.env.SESSION_SECRET),
        encrypt(payload, expires.refresh, process.env.SESSION_SECRET),
    ]);

    return {
        accessToken,
        refreshToken,
        accessTokenExpire: expires.access,
        refreshTokenExpire: expires.refresh,
    };
}

export async function verifySession(jwt: string): Promise<{
    payload: TokenPayload | null;
    isExpired: boolean;
    isInvalid: boolean;
}> {
    try {
        if (!process.env.SESSION_SECRET) {
            throw new Error(ERROR_MSG.SESSION_SECRET_NOT_SET);
        }

        const payload = await decrypt<TokenPayload>(jwt, process.env.SESSION_SECRET);
        return {
            payload,
            isExpired: false,
            isInvalid: false,
        };
    } catch (error) {
        if (error instanceof JWTExpired) {
            // 토큰 만료
            return {
                payload: null,
                isExpired: true,
                isInvalid: false,
            };
        } else if (error instanceof JWSInvalid) {
            // 토큰 유효하지 않음
            return {
                payload: null,
                isExpired: false,
                isInvalid: true,
            };
        }

        throw error;
    }
}

export async function deleteSession(response: Response) {
    response.clearCookie(accessTokenCookie.name);
    response.clearCookie(refreshTokenCookie.name);
}

// {code, message} 형식으로 반환
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
        accessToken,
        refreshToken,
        accessTokenPayload: accessTokenResult.payload as TokenPayload,
        refreshTokenPayload: refreshTokenResult.payload as TokenPayload,
    };
}
