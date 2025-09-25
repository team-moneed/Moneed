import prisma from '@/prisma/client';
import type { OAuthAccount, User } from '@prisma/client';
import type { InsertUserParams, InsertProviderParams } from '@/types/auth.types';

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

    // async findByUserInfo(userInfo: {
    //     name: string;
    //     email: string;
    //     birthyear: string;
    //     birthday: string;
    // }): Promise<User | null> {
    //     return this.prisma.user.findFirst({
    //         where: {
    //             name: userInfo.name,
    //             email: userInfo.email,
    //             birthyear: userInfo.birthyear,
    //             birthday: userInfo.birthday,
    //         },
    //     });
    // }

    async findByNickname(nickname: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                nickname,
            },
        });
    }

    async insertUser(userData: InsertUserParams): Promise<User> {
        return this.prisma.user.create({
            data: userData,
        });
    }

    async updateLastLoginAt(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { lastLoginAt: new Date() },
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
