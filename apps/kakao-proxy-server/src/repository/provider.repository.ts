import prisma from '@/prisma/client';
import type { OAuthAccount } from '@prisma/client';
import type { Optional } from '@moneed/utility-types';
import { KakaoTokenResponse } from '@/types/kakao';
import type { InsertProviderParams } from '@/types/auth.types';

export class ProviderRepository {
    private prisma = prisma;

    async findProviderInfo(
        userId: string,
        provider: string,
    ): Promise<Pick<OAuthAccount, 'providerUserId' | 'accessToken'> | null> {
        return this.prisma.oAuthAccount.findFirst({
            where: {
                userId,
                provider,
            },
            select: {
                providerUserId: true,
                accessToken: true,
            },
        });
    }

    async delete(provider: string, providerUserId: string) {
        return this.prisma.oAuthAccount.delete({
            where: {
                provider_providerUserId: {
                    provider,
                    providerUserId,
                },
            },
        });
    }

    async updateTokenData(
        provider: Pick<OAuthAccount, 'provider' | 'providerUserId'>,
        tokenData: Optional<
            Pick<OAuthAccount, 'accessToken' | 'refreshToken' | 'accessTokenExpiresIn' | 'refreshTokenExpiresIn'>,
            'refreshToken' | 'refreshTokenExpiresIn'
        >,
    ) {
        return this.prisma.oAuthAccount.update({
            where: {
                provider_providerUserId: {
                    provider: provider.provider,
                    providerUserId: provider.providerUserId,
                },
            },
            data: tokenData,
        });
    }

    async updateTokenInfo(userId: string, kakaoToken: KakaoTokenResponse): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                oauthAccounts: {
                    where: {
                        provider: 'kakao',
                    },
                },
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        this.prisma.oAuthAccount.update({
            where: {
                provider_providerUserId: {
                    provider: 'kakao',
                    providerUserId: user.oauthAccounts[0].providerUserId,
                },
            },
            data: {
                accessToken: kakaoToken.access_token,
                refreshToken: kakaoToken.refresh_token,
                accessTokenExpiresIn: new Date(Date.now() + kakaoToken.expires_in * 1000),
                refreshTokenExpiresIn: new Date(Date.now() + kakaoToken.refresh_token_expires_in * 1000),
            },
        });
    }

    async create(
        providerData: Pick<
            OAuthAccount,
            | 'provider'
            | 'providerUserId'
            | 'accessToken'
            | 'refreshToken'
            | 'accessTokenExpiresIn'
            | 'refreshTokenExpiresIn'
        >,
        userId: string,
    ) {
        return this.prisma.oAuthAccount.create({
            data: {
                ...providerData,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }

    async getTokenExpiration(provider: string, accessToken: string) {
        return this.prisma.oAuthAccount.findFirst({
            where: {
                provider,
                accessToken,
            },
            select: {
                accessToken: true,
                refreshToken: true,
                accessTokenExpiresIn: true,
                refreshTokenExpiresIn: true,
                providerUserId: true,
            },
        });
    }

    async getRefreshToken(provider: string, userId: string) {
        return this.prisma.oAuthAccount.findFirst({
            where: {
                provider,
                user: {
                    id: userId,
                },
            },
            select: {
                refreshToken: true,
                refreshTokenExpiresIn: true,
            },
        });
    }

    async insertProvider(providerData: InsertProviderParams, userId: string): Promise<OAuthAccount> {
        return this.prisma.oAuthAccount.create({
            data: {
                ...providerData,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }
}
