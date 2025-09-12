import { prisma } from '@/shared/model';
import type { KISAccessTokenResponse } from '@/features/stock/server';
import { TokenUtils } from '@/shared/utils/token-utils';

export class KisTokenRepository {
    private readonly TOKEN_KEY = 'kis_access_token';

    async getKisToken(): Promise<KISAccessTokenResponse | null> {
        try {
            const token = await prisma.serverTokens.findFirst({
                where: { tokenKey: this.TOKEN_KEY },
            });

            if (!token) return null;

            // JSON 파싱 시도
            try {
                const tokenInfo = JSON.parse(token.tokenValue) as KISAccessTokenResponse;

                // 토큰 만료 시간 확인
                if (!TokenUtils.isTokenExpired(tokenInfo)) {
                    return tokenInfo;
                }

                // 만료된 토큰 삭제
                await this.deleteKisToken();
                return null;
            } catch (error) {
                console.error('Failed to parse KIS token:', error);
                await this.deleteKisToken();
                return null;
            }
        } catch (error) {
            console.error('Failed to get KIS token from database:', error);
            return null;
        }
    }

    async saveKisToken(tokenData: KISAccessTokenResponse): Promise<void> {
        try {
            const tokenJson = JSON.stringify(tokenData);

            await prisma.serverTokens.upsert({
                where: { tokenKey: this.TOKEN_KEY },
                update: {
                    tokenValue: tokenJson,
                },
                create: {
                    tokenKey: this.TOKEN_KEY,
                    tokenValue: tokenJson,
                },
            });
        } catch (error) {
            console.error('Failed to save KIS token to database:', error);
            throw error;
        }
    }

    async deleteKisToken(): Promise<void> {
        try {
            await prisma.serverTokens.deleteMany({
                where: { tokenKey: this.TOKEN_KEY },
            });
        } catch (error) {
            console.error('Failed to delete KIS token from database:', error);
        }
    }

    async isTokenExpired(tokenData: KISAccessTokenResponse): Promise<boolean> {
        return TokenUtils.isTokenExpired(tokenData);
    }
}
