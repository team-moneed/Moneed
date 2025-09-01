import { ServerTokenRepository } from '@/repositories/server-token.repository';
import { getAccessToken } from '@/apis/kis.api';
import { KISAccessTokenResponse } from '@/types/kis';
import { TokenUtils } from '@/utils/token-utils';

export class KISTokenService {
    private serverTokenRepository: ServerTokenRepository;
    private tokenRefreshPromise: Promise<KISAccessTokenResponse> | null = null;

    constructor() {
        this.serverTokenRepository = new ServerTokenRepository();
    }

    async getValidToken(): Promise<KISAccessTokenResponse> {
        // 데이터베이스에서 토큰 조회
        const token = await this.serverTokenRepository.getKisToken();

        // 토큰이 없거나 만료된 경우 새로 발급
        if (!token || (await this.serverTokenRepository.isTokenExpired(token))) {
            return this.refreshToken();
        }

        return token;
    }

    private async refreshToken(): Promise<KISAccessTokenResponse> {
        // 동시 요청 시 중복 토큰 발급 방지
        if (this.tokenRefreshPromise) {
            return this.tokenRefreshPromise;
        }

        this.tokenRefreshPromise = this.performTokenRefresh();

        const token = await this.tokenRefreshPromise;
        this.tokenRefreshPromise = null;
        return token;
    }

    private async performTokenRefresh(): Promise<KISAccessTokenResponse> {
        try {
            console.log('Refreshing KIS access token...');

            const token = await getAccessToken();

            // 새 토큰을 데이터베이스에 저장
            await this.serverTokenRepository.saveKisToken(token);

            TokenUtils.logTokenInfo(token, 'refreshed');
            return token;
        } catch (error) {
            console.error('Failed to refresh KIS access token:', error);
            throw error;
        }
    }

    async clearToken(): Promise<void> {
        await this.serverTokenRepository.deleteKisToken();
    }
}
