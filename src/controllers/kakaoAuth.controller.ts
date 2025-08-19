import { AuthService } from '@/services/auth.service';
import { JWTExpired } from 'jose/errors';
import { TOKEN_ERROR } from '@/constants/token';
import { ERROR_MSG } from '@/constants/errorMsg';
import { AxiosError } from 'axios';
import { createSession } from '@/lib/session';
import { RequiredUserInfo } from '@/types/user';
import { TokenPayload } from '@/types/auth';

/**
 * 카카오 OAuth 인증을 처리하는 컨트롤러
 */
export class KakaoAuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * 기본 프로필 이미지 URL을 생성합니다.
     */
    private getDefaultProfileImage(): string {
        const randomNumber = Math.floor(Math.random() * 15) + 1;
        return `${process.env.NEXT_PUBLIC_MONEED_BASE_URL}/profile/profile-${randomNumber}.svg`;
    }

    /**
     * 카카오 로그인 프로세스를 처리합니다.
     */
    async handleKakaoLogin({
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
                    profileImage: this.getDefaultProfileImage(),
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

            if (error instanceof AxiosError) {
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
}
