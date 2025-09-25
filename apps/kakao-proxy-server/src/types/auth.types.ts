import type { OAuthAccount, User } from '@prisma/client';
import { KakaoTokenResponse } from './kakao';

type Providers = 'kakao';

export interface CheckExistingUserParams {
    provider: Providers;
    providerUserId: string;
}

export type CheckExistingUserResult = { user: User; isExisting: true } | { user: null; isExisting: false };

export type SignInParams = {
    userId: string;
    kakaoToken: KakaoTokenResponse;
};

export type SignUpParams = Pick<
    OAuthAccount,
    'provider' | 'providerUserId' | 'accessToken' | 'refreshToken' | 'accessTokenExpiresIn' | 'refreshTokenExpiresIn'
>;

export interface LogoutParams {
    userId: string;
    provider: Providers;
}

export type LogoutResult =
    | { success: true; data: { accessToken: string; providerUserId: string }; status: number }
    | { success: false; error: string; status: number };

export interface LeaveParams {
    userId: string;
    reason: string;
    provider: Providers;
}

export type LeaveResult =
    | { success: true; data: { accessToken: string; providerUserId: string }; status: number }
    | { success: false; error: string; status: number };

export type InsertUserParams = Pick<User, 'nickname' | 'profileImage'>;

export type InsertProviderParams = Pick<
    OAuthAccount,
    'provider' | 'providerUserId' | 'accessToken' | 'refreshToken' | 'accessTokenExpiresIn' | 'refreshTokenExpiresIn'
>;
