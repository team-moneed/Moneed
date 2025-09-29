import { clearTokensFromCookies, setTokensInCookies } from '@/4_features/user/server';
import { TOKEN_KEY } from '../config';
import { refresh } from '@/4_features/user/api/auth';
import TokenLocalStorage from './token.localstorage';

export class TokenUtils {
    private static tokenPromise: Promise<{ access_token: string; refresh_token: string }> | null = null;
    private static refreshAttempts = 0;
    private static maxRefreshAttempts = 3;

    static refreshToken(): Promise<{
        access_token: string;
        refresh_token: string;
    }> {
        if (TokenUtils.refreshAttempts >= TokenUtils.maxRefreshAttempts) {
            throw new Error('세션 갱신 실패');
        }

        if (TokenUtils.tokenPromise) {
            return TokenUtils.tokenPromise;
        }

        TokenUtils.refreshAttempts++;
        TokenUtils.tokenPromise = refresh({
            provider: 'kakao',
            refreshToken: TokenLocalStorage.getToken(TOKEN_KEY.REFRESH_TOKEN),
        })
            .then(({ access_token, refresh_token }) => {
                TokenLocalStorage.setTokens(access_token, refresh_token);
                setTokensInCookies(access_token, refresh_token);
                TokenUtils.refreshAttempts = 0;
                return { access_token, refresh_token };
            })
            .catch(error => {
                TokenLocalStorage.clearTokens();
                clearTokensFromCookies();
                throw error;
            })
            .finally(() => {
                TokenUtils.tokenPromise = null;
            });

        return TokenUtils.tokenPromise;
    }
}
