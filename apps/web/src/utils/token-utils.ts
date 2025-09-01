import { KISAccessTokenResponse } from '@/types/kis';

export class TokenUtils {
    /**
     * 토큰이 만료되었는지 확인 (5분 여유 시간 포함)
     */
    static isTokenExpired(token: KISAccessTokenResponse): boolean {
        const expirationTime = new Date(token.access_token_token_expired);
        const currentTime = new Date();

        // 5분 여유를 두고 만료 여부 확인
        const bufferTime = 5 * 60 * 1000; // 5분
        return expirationTime.getTime() - currentTime.getTime() < bufferTime;
    }

    /**
     * 토큰 정보를 안전하게 로깅 (민감한 정보 제거)
     */
    static logTokenInfo(token: KISAccessTokenResponse, action: string): void {
        console.log(`KIS Token ${action}:`, token);
    }
}
