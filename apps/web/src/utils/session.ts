import 'server-only';
import { cookies } from 'next/headers';
import type { TokenPayload } from '@moneed/auth';
import { accessTokenCookie, decrypt, encrypt, refreshTokenCookie } from '@moneed/auth';
import { ERROR_MSG } from '@/constants/error';

export async function createSession(payload: TokenPayload) {
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
        if (!process.env.SESSION_SECRET) {
            throw new Error(ERROR_MSG.SESSION_SECRET_NOT_SET);
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(accessTokenCookie.name)?.value;
        const payload = await decrypt<TokenPayload>(accessToken, process.env.SESSION_SECRET);
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateSession() {
    try {
        if (!process.env.SESSION_SECRET) {
            throw new Error(ERROR_MSG.SESSION_SECRET_NOT_SET);
        }

        const currentRefreshToken = (await cookies()).get(refreshTokenCookie.name)?.value;
        const payload = await decrypt<TokenPayload>(currentRefreshToken, process.env.SESSION_SECRET);
        await createSession(payload);
        return payload;
    } catch (error) {
        console.error(error);
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
