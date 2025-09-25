import { UserRepository } from '@/repository/user.repository';
import type { User } from '@prisma/client';
import { ProviderRepository } from '@/repository/provider.repository';
import { NicknameService } from '@/service/nickname.service';
import LeaveReasonRepository from '@/repository/leaveReason.repository';
import { ERROR_MSG } from '@/constants/error';
import type {
    CheckExistingUserParams,
    CheckExistingUserResult,
    SignInParams,
    SignUpParams,
    LogoutParams,
    LogoutResult,
    LeaveParams,
    LeaveResult,
} from '@/types/auth.types';
import { generateRandomImage } from '@/utils/random';

export class AuthService {
    private userRepository: UserRepository;
    private providerRepository: ProviderRepository;
    private nicknameService: NicknameService;

    constructor() {
        this.userRepository = new UserRepository();
        this.providerRepository = new ProviderRepository();
        this.nicknameService = new NicknameService();
    }

    async checkExistingUser({ provider, providerUserId }: CheckExistingUserParams): Promise<CheckExistingUserResult> {
        const existingUser = await this.userRepository.findByProvider({
            provider: provider,
            providerUserId: providerUserId,
        });

        if (existingUser) {
            return { user: existingUser, isExisting: true };
        }

        return { user: null, isExisting: false };
    }

    async signIn({ userId, kakaoToken }: SignInParams): Promise<User> {
        await Promise.all([
            this.providerRepository.updateTokenInfo(userId, kakaoToken),
            this.userRepository.updateLastLoginAt(userId),
        ]);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async signUp(providerData: SignUpParams): Promise<User> {
        const uniqueNickname = await this.nicknameService.generateUniqueNickname();
        const profileImage = generateRandomImage();

        const user = await this.userRepository.insertUser({
            nickname: uniqueNickname,
            profileImage: profileImage,
        });

        await this.providerRepository.insertProvider(providerData, user.id);
        return user;
    }

    async logout({ userId, provider }: LogoutParams): Promise<LogoutResult> {
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

    async leave({ userId, reason, provider }: LeaveParams): Promise<LeaveResult> {
        console.log('leave', userId, reason, provider);
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
