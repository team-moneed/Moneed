import { TokenPayload } from '@/types/auth';
import { AuthService } from './auth.service';
import { RequiredUserInfo } from '@/types/user';
import { createSession, deleteSession } from '@/lib/session';
import { JWTExpired } from 'jose/errors';
import { TOKEN_ERROR } from '@/constants/token';
import { AxiosError, isAxiosError } from 'axios';
import { ERROR_MSG } from '@/constants/errorMsg';
import { ProviderRepository } from '@/repositories/provider.repository';
import { logoutKakao } from '@/apis/kakao.api';

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
        { success: true; data: TokenPayload; status: number } | { success: false; error: string; status: number }
    > {
        try {
            const { accessToken, refreshToken, accessTokenExpiresInSec, refreshTokenExpiresInSec } =
                await this.authService.getTokenWithKakao(code);
            const kakaoUserInfo = await this.authService.getKakaoUserInfo(accessToken);

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
                userId: '',
                nickname: '',
            };

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
                    userId: user.id,
                    nickname: user.nickname,
                };
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
                    userId: newUser.id,
                    nickname: newUser.nickname,
                };
            }

            await createSession(payload);

            return {
                success: true,
                data: payload,
                status: 200,
            };
        } catch (error) {
            if (error instanceof JWTExpired) {
                console.error('JWT token expired', error.message);
                return {
                    success: false,
                    error: TOKEN_ERROR.EXPIRED_TOKEN,
                    status: 401,
                };
            }

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

    async logout(
        userId: string,
    ): Promise<{ success: true; message: string; status: number } | { success: false; error: string; status: number }> {
        try {
            const result = await this.authService.logout(userId, 'kakao');
            if (!result.success) {
                return result;
            }

            await deleteSession();
            await logoutKakao({
                accessToken: result.data.accessToken,
                providerUserId: result.data.providerUserId,
            });
            return {
                success: result.success,
                message: '로그아웃 성공',
                status: result.status,
            };
        } catch (e) {
            const error = e as AxiosError<{ msg: string; code: number }>;
            if (error.response?.data?.code === -401) {
                await deleteSession();
                return {
                    success: false,
                    error: error.response?.data?.msg,
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
}
