import 'server-only';
import { ERROR_MSG, SessionResult, verifyToken } from '@moneed/auth';
import { cookies } from 'next/headers';
import { TOKEN_KEY } from '../config';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export default class TokenCookie {
    static getCookie = async (key: string) => {
        const cookieStore = await cookies();
        return cookieStore.get(key)?.value;
    };

    static deleteCookie = async (key: string) => {
        const cookieStore = await cookies();
        cookieStore.delete(key);
    };

    static setCookie = async (key: string, value: string, options: RequestCookie) => {
        const cookieStore = await cookies();
        cookieStore.set(key, value, options);
    };

    static clearCookie = async () => {
        const cookieStore = await cookies();
        cookieStore.delete(TOKEN_KEY.ACCESS_TOKEN);
        cookieStore.delete(TOKEN_KEY.REFRESH_TOKEN);
    };

    static async verifyRequestCookies(): Promise<SessionResult> {
        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);

        if (!accessToken) {
            return {
                data: null,
                error: new Error(ERROR_MSG.NO_ACCESS_TOKEN),
            };
        }

        return await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
    }
}
