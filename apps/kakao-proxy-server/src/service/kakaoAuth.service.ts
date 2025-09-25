import type { TokenPayload } from '@moneed/auth';
import { AuthService } from '@/service/auth.service';
import { AxiosError } from 'axios';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/error';
import { leaveKakao, logoutKakao, refreshKakaoToken } from '@/api/kakao.api';
import { ProviderRepository } from '@/repository/provider.repository';
import { KakaoRefreshTokenResponse } from '@/types/kakao';

export class KakaoAuthService {
    private authService: AuthService;
    private providerRepository: ProviderRepository;

    constructor() {
        this.authService = new AuthService();
        this.providerRepository = new ProviderRepository();
    }

    async logout({
        userId,
    }: {
        userId: string;
    }): Promise<
        { success: true; message: string; status: number } | { success: false; error: string; status: number }
    > {
        try {
            const result = await this.authService.logout({ userId, provider: 'kakao' });
            if (result.success === false) {
                return result;
            }

            await logoutKakao({
                accessToken: result.data.accessToken,
                providerUserId: result.data.providerUserId,
            });
            return {
                success: result.success,
                message: SUCCESS_MSG.LOGOUT,
                status: result.status,
            };
        } catch (e) {
            const error = e as AxiosError<{ msg: string; code: number }>;
            console.error('로그아웃 오류:', error);
            if (error.status === 401) {
                return {
                    success: true,
                    message: SUCCESS_MSG.LOGOUT,
                    status: 200,
                };
            }
            return {
                success: false,
                error: ERROR_MSG.KAKAO_INTERNAL_ERROR,
                status: 500,
            };
        }
    }

    async leave({ userId, reason }: { userId: string; reason: string }) {
        try {
            const result = await this.authService.leave({ userId, reason, provider: 'kakao' });
            if (!result.success) {
                return result;
            }

            await leaveKakao({
                accessToken: result.data.accessToken,
                providerUserId: result.data.providerUserId,
            });

            return {
                success: result.success,
                message: '탈퇴 성공',
                status: result.status,
            };
        } catch (error) {
            console.error('Kakao leave error:', error, userId);
            return {
                success: false,
                error: ERROR_MSG.KAKAO_INTERNAL_ERROR,
                status: 500,
            };
        }
    }

    async refresh({
        userId,
    }: {
        userId: string;
    }): Promise<
        | { success: true; data: KakaoRefreshTokenResponse; status: number }
        | { success: false; error: string; status: number }
    > {
        const currentRefreshToken = await this.providerRepository.getRefreshToken('kakao', userId);
        if (!currentRefreshToken || currentRefreshToken.refreshTokenExpiresIn < new Date()) {
            return {
                success: false,
                error: '리프래시 토큰이 유효하지 않습니다',
                status: 401,
            };
        }

        const newToken = await refreshKakaoToken(currentRefreshToken.refreshToken);
        const providerData = await this.providerRepository.findProviderInfo(userId, 'kakao');

        if (!providerData) {
            return {
                success: false,
                error: 'OAuth 계정이 존재하지 않습니다',
                status: 404,
            };
        }

        await this.providerRepository.updateTokenData(
            {
                provider: 'kakao',
                providerUserId: providerData.providerUserId,
            },
            {
                accessToken: newToken.access_token,
                refreshToken: newToken.refresh_token,
                accessTokenExpiresIn: new Date(Date.now() + newToken.expires_in * 1000),
                refreshTokenExpiresIn: newToken.refresh_token_expires_in
                    ? new Date(Date.now() + newToken.refresh_token_expires_in * 1000)
                    : undefined,
            },
        );
        return {
            success: true,
            data: newToken,
            status: 200,
        };
    }
}
