import { prisma, RequiredUserInfo } from '@moneed/db';
import { OAuthAccount, User } from '@moneed/db/generated';

export class UserRepository {
    private prisma = prisma;

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findByProvider(providerData: Pick<OAuthAccount, 'provider' | 'providerUserId'>): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                oauthAccounts: {
                    some: providerData,
                },
            },
        });
    }

    async findByUserInfo(userInfo: {
        name: string;
        email: string;
        birthyear: string;
        birthday: string;
    }): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                name: userInfo.name,
                email: userInfo.email,
                birthyear: userInfo.birthyear,
                birthday: userInfo.birthday,
            },
        });
    }

    async findByNickname(nickname: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                nickname,
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
        > | null,
        userData: RequiredUserInfo,
    ): Promise<User> {
        if (providerData) {
            return this.prisma.user.create({
                data: {
                    ...userData,
                    oauthAccounts: {
                        create: providerData,
                    },
                },
            });
        }

        return this.prisma.user.create({
            data: userData,
        });
    }

    async delete(userId: string) {
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }

    async update(userId: string, userData: Partial<User>) {
        return this.prisma.user.update({
            where: { id: userId },
            data: userData,
        });
    }
}
