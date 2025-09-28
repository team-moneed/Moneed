import { TOKEN_KEY } from '../config';
import { DecodedToken } from '@moneed/auth';
import { decodeJwt } from 'jose';

export default class TokenLocalStorage {
    /**
     * 액세스 토큰과 리프레쉬 토큰을 로컬스토리지와 쿠키에 저장
     */
    static setTokens = (accessToken: string, refreshToken: string): void => {
        if (typeof window === 'undefined') return;

        // 로컬스토리지에 저장
        localStorage.setItem(TOKEN_KEY.ACCESS_TOKEN, accessToken);
        localStorage.setItem(TOKEN_KEY.REFRESH_TOKEN, refreshToken);
        console.log('로컬스토리지 저장 성공');
    };

    static getToken(key: string) {
        if (typeof window === 'undefined') return null;

        return localStorage.getItem(key);
    }

    /**
     * 모든 토큰을 로컬스토리지와 쿠키에서 삭제 (로그아웃)
     */
    static clearTokens = () => {
        if (typeof window === 'undefined') return;

        // 로컬스토리지에서 삭제
        localStorage.removeItem(TOKEN_KEY.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEY.REFRESH_TOKEN);
    };

    /**
     * 토큰 디코딩
     */
    static decodeToken = (token?: string): DecodedToken | null => {
        const accessToken = token || TokenLocalStorage.getToken(TOKEN_KEY.ACCESS_TOKEN);
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
        const decodedToken = TokenLocalStorage.decodeToken(token);
        if (!decodedToken) return true;

        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    };

    /**
     * 유효한 액세스 토큰이 있는지 확인
     */
    static hasValidAccessToken = (): boolean => {
        const accessToken = TokenLocalStorage.getToken(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) return false;

        return !TokenLocalStorage.isTokenExpired(accessToken);
    };

    /**
     * 로그인 상태 확인
     */
    static isAuthenticated = (): boolean => {
        return TokenLocalStorage.hasValidAccessToken();
    };

    /**
     * 액세스 토큰만 업데이트 (리프레쉬 시 사용)
     */
    static updateAccessToken = async (accessToken: string): Promise<void> => {
        if (typeof window === 'undefined') return;

        // 로컬스토리지 업데이트
        localStorage.setItem(TOKEN_KEY.ACCESS_TOKEN, accessToken);
    };
}
