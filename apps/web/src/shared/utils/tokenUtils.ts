import {
    clearTokensFromCookies,
    setTokensInCookies,
    updateAccessTokenInCookies,
} from '@/features/auth/server/auth.actions';
import { DecodedToken } from '@moneed/auth';
import { decodeJwt } from 'jose';

const ACCESS_TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_ACCESS_NAME || 'access_token';
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_REFRESH_NAME || 'refresh_token';

export class TokenUtils {
    /**
     * 액세스 토큰과 리프레쉬 토큰을 로컬스토리지와 쿠키에 저장
     */
    static setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
        if (typeof window === 'undefined') return;

        // 로컬스토리지에 저장
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        console.log('로컬스토리지 저장 성공');

        // 서버 액션으로 쿠키에도 저장
        try {
            await setTokensInCookies(accessToken, refreshToken);
            console.log('쿠키 저장 성공');
        } catch (error) {
            console.warn('쿠키 저장 실패:', error);
        }
    };

    /**
     * 로컬스토리지에서 액세스 토큰 조회
     */
    static getAccessToken = (): string | null => {
        if (typeof window === 'undefined') return null;

        return localStorage.getItem(ACCESS_TOKEN_KEY);
    };

    /**
     * 로컬스토리지에서 리프레쉬 토큰 조회
     */
    static getRefreshToken = (): string | null => {
        if (typeof window === 'undefined') return null;

        return localStorage.getItem(REFRESH_TOKEN_KEY);
    };

    /**
     * 모든 토큰을 로컬스토리지와 쿠키에서 삭제 (로그아웃)
     */
    static clearTokens = async (): Promise<void> => {
        if (typeof window === 'undefined') return;

        // 로컬스토리지에서 삭제
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        // 서버 액션으로 쿠키에서도 삭제
        try {
            await clearTokensFromCookies();
            console.log('쿠키 삭제 성공');
        } catch (error) {
            console.warn('쿠키 삭제 실패:', error);
        }
    };

    /**
     * 토큰 디코딩
     */
    static decodeToken = (token?: string): DecodedToken | null => {
        const accessToken = token || TokenUtils.getAccessToken();
        if (!accessToken) return null;

        try {
            return decodeJwt<DecodedToken>(accessToken);
        } catch (error) {
            console.error('토큰 디코딩 실패:', error);
            return null;
        }
    };

    /**
     * 토큰 만료 체크
     */
    static isTokenExpired = (token?: string): boolean => {
        const decodedToken = TokenUtils.decodeToken(token);
        if (!decodedToken) return true;

        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    };

    /**
     * 유효한 액세스 토큰이 있는지 확인
     */
    static hasValidAccessToken = (): boolean => {
        const accessToken = TokenUtils.getAccessToken();
        if (!accessToken) return false;

        return !TokenUtils.isTokenExpired(accessToken);
    };

    /**
     * 로그인 상태 확인
     */
    static isAuthenticated = (): boolean => {
        return TokenUtils.hasValidAccessToken();
    };

    /**
     * 액세스 토큰만 업데이트 (리프레쉬 시 사용)
     */
    static updateAccessToken = async (accessToken: string): Promise<void> => {
        if (typeof window === 'undefined') return;

        // 로컬스토리지 업데이트
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

        // 서버 액션으로 쿠키도 업데이트
        try {
            updateAccessTokenInCookies(accessToken);
        } catch (error) {
            console.warn('쿠키 업데이트 실패:', error);
        }
    };
}
