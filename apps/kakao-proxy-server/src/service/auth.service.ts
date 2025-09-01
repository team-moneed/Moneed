import { UserRepository } from '@/repository/user.repository';
import { OAuthAccount, User } from '@prisma/client';
import { ProviderRepository } from '@/repository/provider.repository';
import { RequiredUserInfo, UserInfo } from '@/database/types';
import { NicknameService } from '@/service/nickname.service';
import { ProviderInfo, Providers } from '@moneed/auth';
import LeaveReasonRepository from '@/repository/leaveReason.repository';
import { ERROR_MSG } from '@/constants/error';
import { Response } from 'express';

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
        return `${process.env.MONEED_BASE_URL}/profile/profile-${randomNumber}.svg`;
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

    async logout({
        userId,
        provider,
        response,
    }: {
        userId: string;
        provider: Providers;
        response: Response;
    }): Promise<
        | { success: true; data: { accessToken: string; providerUserId: string }; status: number }
        | { success: false; error: string; status: number }
    > {
        const providerInfo = await this.providerRepository.findProviderInfo(userId, provider);
        if (!providerInfo) {
            return {
                success: false,
                error: ERROR_MSG.KAKAO_PROVIDER_INFO_NOT_FOUND,
                status: 400,
            };
        }

        if (!providerInfo.accessToken) {
            return {
                success: false,
                error: ERROR_MSG.KAKAO_ACCESS_TOKEN_NOT_FOUND,
                status: 401,
            };
        }

        return {
            success: true,
            data: {
                accessToken: providerInfo.accessToken,
                providerUserId: providerInfo.providerUserId,
            },
            status: 200,
        };
    }

    async leave({
        userId,
        reason,
        provider,
        response,
    }: {
        userId: string;
        reason: string;
        provider: Providers;
        response: Response;
    }): Promise<
        | { success: true; data: { accessToken: string; providerUserId: string }; status: number }
        | { success: false; error: string; status: number }
    > {
        const leaveReasonRepository = new LeaveReasonRepository();
        const providerInfo = await this.providerRepository.findProviderInfo(userId, provider);

        if (!providerInfo) {
            return {
                success: false,
                error: ERROR_MSG.KAKAO_PROVIDER_INFO_NOT_FOUND,
                status: 400,
            };
        }

        if (!providerInfo.accessToken) {
            return {
                success: false,
                error: ERROR_MSG.KAKAO_ACCESS_TOKEN_NOT_FOUND,
                status: 401,
            };
        }

        // 카카오 연결 해제 시도
        await this.userRepository.delete(userId);
        await leaveReasonRepository.createLeaveReason(reason);
        return {
            success: true,
            data: {
                accessToken: providerInfo.accessToken,
                providerUserId: providerInfo.providerUserId,
            },
            status: 200,
        };
    }
}
