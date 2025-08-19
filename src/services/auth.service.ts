import { UserRepository } from '@/repositories/user.repository';
import { OAuthAccount, User } from '@/generated/prisma';
import { deleteSession } from '@/lib/session';
import { getKakaoToken, getKakaoUserInfo, leaveKakao } from '@/apis/kakao.api';
import { ProviderRepository } from '@/repositories/provider.repository';
import { RequiredUserInfo, UserInfo } from '@/types/user';
import { NicknameService } from '@/services/nickname.service';
import { ProviderInfo, Providers } from '@/types/auth';
import LeaveReasonRepository from '@/repositories/leaveReason.repository';
import { ERROR_MSG } from '@/constants/errorMsg';

// TODO: 추상화 (카카오 로그인 외 다른 로그인 추가 시 수정 필요)
export class AuthService {
    private userRepository: UserRepository;
    private providerRepository: ProviderRepository;
    private nicknameService: NicknameService;

    constructor() {
        this.userRepository = new UserRepository();
        this.providerRepository = new ProviderRepository();
        this.nicknameService = new NicknameService();
    }

    createDefaultProfileImage(): string {
        const randomNumber = Math.floor(Math.random() * 15) + 1;
        return `${process.env.NEXT_PUBLIC_MONEED_BASE_URL}/profile/profile-${randomNumber}.svg`;
    }

    async checkExistingUser({
        userInfo,
        provider,
    }: {
        userInfo: UserInfo;
        provider: ProviderInfo;
    }): Promise<{ user: User; isExisting: true } | { user: null; isExisting: false }> {
        const existingUserByProvider = await this.userRepository.findByProvider({
            provider: provider.provider,
            providerUserId: provider.providerUserId,
        });

        if (existingUserByProvider) {
            return { user: existingUserByProvider, isExisting: true };
        }

        const existingUserByUserInfo = await this.userRepository.findByUserInfo(userInfo);

        if (existingUserByUserInfo) {
            return { user: existingUserByUserInfo, isExisting: true };
        }

        return { user: null, isExisting: false };
    }

    async signIn(
        userId: string,
        providerData: Pick<
            OAuthAccount,
            | 'provider'
            | 'providerUserId'
            | 'accessToken'
            | 'refreshToken'
            | 'accessTokenExpiresIn'
            | 'refreshTokenExpiresIn'
        >,
    ): Promise<User> {
        await this.providerRepository.upsert(userId, providerData);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async signUp(
        user: Omit<RequiredUserInfo, 'nickname'>,
        providerData: Pick<
            OAuthAccount,
            | 'provider'
            | 'providerUserId'
            | 'accessToken'
            | 'refreshToken'
            | 'accessTokenExpiresIn'
            | 'refreshTokenExpiresIn'
        >,
    ): Promise<User> {
        // 랜덤 닉네임 생성
        const uniqueNickname = await this.nicknameService.generateUniqueNickname();

        // 사용자 데이터에 생성된 닉네임 추가
        const userWithNickname: RequiredUserInfo = {
            ...user,
            nickname: uniqueNickname,
        };

        return this.userRepository.create(providerData, userWithNickname);
    }

    async logout(
        userId: string,
        provider: Providers,
    ): Promise<
        | { success: true; data: { accessToken: string; providerUserId: string }; status: number }
        | { success: false; error: string; status: number }
    > {
        const providerInfo = await this.providerRepository.findProviderInfo(userId, provider);
        if (!providerInfo) {
            await deleteSession();
            return {
                success: false,
                error: ERROR_MSG.KAKAO_PROVIDER_INFO_NOT_FOUND,
                status: 400,
            };
        }

        if (!providerInfo.accessToken) {
            await deleteSession();
            return {
                success: false,
                error: ERROR_MSG.KAKAO_ACCESS_TOKEN_NOT_FOUND,
                status: 400,
            };
        }

        await deleteSession();
        return {
            success: true,
            data: {
                accessToken: providerInfo.accessToken,
                providerUserId: providerInfo.providerUserId,
            },
            status: 200,
        };
    }

    async leaveWithKakao({ userId, reason }: { userId: string; reason: string }) {
        const leaveReasonRepository = new LeaveReasonRepository();
        const providerInfo = await this.providerRepository.findProviderInfo(userId, 'kakao');
        if (!providerInfo) {
            await deleteSession();
            return {
                ok: false,
                reason: 'Provider information not found',
            };
        }

        const { accessToken, providerUserId } = providerInfo;
        if (!accessToken) {
            await deleteSession();
            return {
                ok: false,
                reason: 'Access token not found',
            };
        }

        // 카카오 연결 해제 시도
        const kakaoResponse = await leaveKakao({ accessToken, providerUserId });
        if (kakaoResponse.id) {
            const user = await this.userRepository.findByProvider({
                provider: 'kakao',
                providerUserId: kakaoResponse.id.toString(),
            });

            if (user) {
                await this.leave(user.id);
                await leaveReasonRepository.createLeaveReason(reason);
                return {
                    ok: true,
                };
            }
        }

        return {
            ok: false,
            reason: 'Failed to process leave request',
        };
    }

    async getTokenWithKakao(code: string) {
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

    async getKakaoUserInfo(kakaoAccessToken: string) {
        const kakaoUserInfo = await getKakaoUserInfo(kakaoAccessToken);
        return kakaoUserInfo;
    }

    async leave(userId: string) {
        await this.userRepository.delete(userId);
        await deleteSession();
    }
}
