import { SignJWT, jwtVerify } from 'jose';
import { SessionResult, TokenPayload } from './types/auth';
import { JWSInvalid, JWTExpired } from 'jose/errors';

const getEncodedKey = (key: string) => {
    return new TextEncoder().encode(key);
};

export const getAccessTokenCookie = (duration: string | Date | number, name: string) => {
    return {
        name,
        options: {
            secure: true,
            sameSite: 'none' as const,
            path: '/',
        },
        duration,
    };
};

export const getRefreshTokenCookie = (duration: string | Date | number, name: string) => {
    return {
        name,
        options: {
            httpOnly: true,
            secure: true,
            sameSite: 'none' as const,
            path: '/',
        },
        duration,
    };
};

export async function encrypt<T extends TokenPayload>(payload: T, exp: Date | string | number, key: string) {
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

export async function createToken({
    payload,
    duration,
    key,
}: {
    payload: TokenPayload;
    duration: string | Date | number;
    key: string;
}): Promise<string> {
    const token = await encrypt(payload, duration, key);

    return token;
}

export async function verifyToken({ jwt, key }: { jwt: string; key: string }): Promise<SessionResult> {
    try {
        const payload = await decrypt<TokenPayload>(jwt, key);
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

        return {
            payload: null,
            isExpired: true,
            isInvalid: true,
        };
    }
}
