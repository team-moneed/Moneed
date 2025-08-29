import { prisma } from '@/database/client';
import type { OAuthAccount } from '@/generated/prisma-client-js';
import type { ProviderInfo } from '@moneed/auth';
import type { Optional } from '@moneed/utility-types';

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
        provider: ProviderInfo,
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

    async upsert(
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
    ) {
        const { provider, providerUserId, accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
            providerData;

        return this.prisma.oAuthAccount.upsert({
            where: {
                provider_providerUserId: {
                    provider,
                    providerUserId,
                },
            },
            update: {
                accessToken,
                refreshToken,
                accessTokenExpiresIn,
                refreshTokenExpiresIn,
            },
            create: {
                provider,
                providerUserId,
                accessToken,
                refreshToken,
                accessTokenExpiresIn,
                refreshTokenExpiresIn,
                user: {
                    connect: {
                        id: userId,
                    },
                },
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
}
