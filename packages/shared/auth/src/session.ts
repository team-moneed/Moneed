import { SignJWT, jwtVerify } from 'jose';
import { TOKEN_EXPIRATION } from './constants/token';
import { SessionResult, TokenPayload } from './types/auth';
import { JWSInvalid, JWTExpired } from 'jose/errors';
import { ERROR_MSG } from './constants';

const getEncodedKey = (key: string) => {
    return new TextEncoder().encode(key);
};

export const accessTokenCookie = {
    name: 'access_token',
    options: {
        secure: true,
        sameSite: 'lax' as const,
        path: '/',
    },
    duration: TOKEN_EXPIRATION.ACCESS_TOKEN,
};

export const refreshTokenCookie = {
    name: 'refresh_token',
    options: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax' as const,
        path: '/',
    },
    duration: TOKEN_EXPIRATION.REFRESH_TOKEN,
};

export async function encrypt<T extends TokenPayload>(payload: T, exp: Date, key: string) {
    const encodedKey = getEncodedKey(key);
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(encodedKey);
}

export async function decrypt<T extends TokenPayload>(jwt: string, key: string) {
    const encodedKey = getEncodedKey(key);
    const { payload } = await jwtVerify(jwt, encodedKey, {
        algorithms: ['HS256'],
    });
    return payload as T;
}

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

export async function verifySession(jwt: string): Promise<SessionResult> {
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
