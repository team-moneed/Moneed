import { SignJWT, jwtVerify } from 'jose';
import { TOKEN_EXPIRATION } from './constants/token';
import { TokenPayload } from './types/auth';

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
