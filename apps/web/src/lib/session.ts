import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { TOKEN_EXPIRATION } from '@/constants/token';
import { TokenPayload } from '@moneed/shared-types';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const accessTokenCookie = {
    name: 'access_token',
    options: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
    },
    duration: TOKEN_EXPIRATION.ACCESS_TOKEN,
};

export const refreshTokenCookie = {
    name: 'refresh_token',
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
    },
    duration: TOKEN_EXPIRATION.REFRESH_TOKEN,
};

export async function encrypt<T extends TokenPayload>(payload: T, exp: Date) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(encodedKey);
}

export async function decrypt<T extends TokenPayload>(jwt: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(jwt, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload as T;
    } catch (error) {
        throw error;
    }
}

export async function createSession(payload: TokenPayload) {
    const expires = {
        access: new Date(Date.now() + accessTokenCookie.duration),
        refresh: new Date(Date.now() + refreshTokenCookie.duration),
    };

    const [accessToken, refreshToken] = await Promise.all([
        encrypt(payload, expires.access),
        encrypt(payload, expires.refresh),
    ]);

    const cookieStore = await cookies();
    cookieStore.set(accessTokenCookie.name, accessToken, {
        ...accessTokenCookie.options,
        expires: expires.access,
    });
    cookieStore.set(refreshTokenCookie.name, refreshToken, {
        ...refreshTokenCookie.options,
        expires: expires.refresh,
    });
}

export async function verifySession() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(accessTokenCookie.name)?.value;
        const payload = await decrypt<TokenPayload>(accessToken);
        return payload;
    } catch {
        return null;
    }
}

export async function updateSession() {
    try {
        const currentRefreshToken = (await cookies()).get(refreshTokenCookie.name)?.value;
        const payload = await decrypt<TokenPayload>(currentRefreshToken);
        await createSession(payload);
        return payload;
    } catch {
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(accessTokenCookie.name);
    cookieStore.delete(refreshTokenCookie.name);
}

/**
 * 유효한 토큰일 경우 토큰 정보를 반환, 유효하지 않은 토큰일 경우 null을 반환
 */
export async function getSession(): Promise<TokenPayload | null> {
    let payload = await verifySession();

    if (payload) {
        return payload;
    }

    payload = await updateSession();

    if (payload) {
        return payload;
    }

    await deleteSession();
    return null;
}
