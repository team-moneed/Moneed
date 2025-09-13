import type { RequiredUserInfo } from '@/database/types';
import type { TokenPayload } from '@moneed/auth';
import { AuthService } from '@/service/auth.service';
import { AxiosError, isAxiosError } from 'axios';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/error';
import { getKakaoToken, getKakaoUserInfo, leaveKakao, logoutKakao, refreshKakaoToken } from '@/api/kakao.api';
import { Response } from 'express';
import { ProviderRepository } from '@/repository/provider.repository';
import { KakaoRefreshTokenResponse } from '@/types/kakao';

export class KakaoAuthService {
    private authService: AuthService;
    private providerRepository: ProviderRepository;

    constructor() {
        this.authService = new AuthService();
        this.providerRepository = new ProviderRepository();
    }

    async login({
        code,
    }: {
        code: string;
    }): Promise<
        | { success: true; data: { payload: TokenPayload; isNewUser: boolean }; status: number }
        | { success: false; error: string; status: number }
    > {
        try {
            const { accessToken, refreshToken, accessTokenExpiresInSec, refreshTokenExpiresInSec } =
                await this.getToken(code);
            const kakaoUserInfo = await this.getUserInfo(accessToken);

            const existingUser = await this.authService.checkExistingUser({
                userInfo: {
                    name: kakaoUserInfo.kakao_account.name,
                    email: kakaoUserInfo.kakao_account.email,
                    birthyear: kakaoUserInfo.kakao_account.birthyear,
                    birthday: kakaoUserInfo.kakao_account.birthday,
                },
                provider: {
                    provider: 'kakao',
                    providerUserId: kakaoUserInfo.id.toString(),
                },
            });

            let payload: TokenPayload = {
                id: '',
                nickname: '',
                profileImage: '',
            };
            let isNewUser = false;

            if (existingUser.isExisting) {
                const user = await this.authService.signIn(existingUser.user.id, {
                    provider: 'kakao',
                    providerUserId: kakaoUserInfo.id.toString(),
                    accessToken,
                    refreshToken,
                    accessTokenExpiresIn: new Date(Date.now() + accessTokenExpiresInSec * 1000),
                    refreshTokenExpiresIn: new Date(Date.now() + refreshTokenExpiresInSec * 1000),
                });

                payload = {
                    id: user.id,
                    nickname: user.nickname,
                    profileImage: user.profileImage,
                };
                isNewUser = false;
            } else {
                const user: Omit<RequiredUserInfo, 'nickname'> = {
                    name: kakaoUserInfo.kakao_account.name,
                    email: kakaoUserInfo.kakao_account.email,
                    birthyear: kakaoUserInfo.kakao_account.birthyear,
                    birthday: kakaoUserInfo.kakao_account.birthday,
                    profileImage: this.authService.createDefaultProfileImage(),
                    ageRange: kakaoUserInfo.kakao_account.age_range,
                    gender: kakaoUserInfo.kakao_account.gender,
                };
                const newUser = await this.authService.signUp(user, {
                    provider: 'kakao',
                    providerUserId: kakaoUserInfo.id.toString(),
                    accessToken,
                    refreshToken,
                    accessTokenExpiresIn: new Date(Date.now() + accessTokenExpiresInSec * 1000),
                    refreshTokenExpiresIn: new Date(Date.now() + refreshTokenExpiresInSec * 1000),
                });

                payload = {
                    id: newUser.id,
                    nickname: newUser.nickname,
                    profileImage: newUser.profileImage,
                };
                isNewUser = true;
            }

            return {
                success: true,
                data: {
                    payload,
                    isNewUser,
                },
                status: 200,
            };
        } catch (error) {
            if (isAxiosError(error)) {
                console.error('OAuth callback error:', error.response?.data);
                return {
                    success: false,
                    error: error.response?.data || ERROR_MSG.KAKAO_INTERNAL_ERROR,
                    status: error.response?.status || 500,
                };
            }

            return {
                success: false,
                error: ERROR_MSG.KAKAO_INTERNAL_ERROR,
                status: 500,
            };
        }
    }

    async logout({
        userId,
        response,
    }: {
        userId: string;
        response: Response;
    }): Promise<
        { success: true; message: string; status: number } | { success: false; error: string; status: number }
    > {
        try {
            const result = await this.authService.logout({ userId, provider: 'kakao', response });
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

    async leave({ userId, reason, response }: { userId: string; reason: string; response: Response }) {
        try {
            const result = await this.authService.leave({ userId, reason, provider: 'kakao', response });
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

    async getToken(code: string) {
        const kakaoToken = await getKakaoToken(code);
        const {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: accessTokenExpiresInSec,
            refresh_token_expires_in: refreshTokenExpiresInSec,
        } = kakaoToken;

        return {
            accessToken,
            refreshToken,
            accessTokenExpiresInSec,
            refreshTokenExpiresInSec,
        };
    }

    async getUserInfo(kakaoAccessToken: string) {
        const kakaoUserInfo = await getKakaoUserInfo(kakaoAccessToken);
        return kakaoUserInfo;
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
