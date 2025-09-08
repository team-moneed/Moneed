import { prisma } from '@/database/client';
import { User } from '@prisma/client';

export class UserRepository {
    private prisma = prisma;

    async findFirst({ field, value }: { field: 'id' | 'nickname'; value: string }): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                [field]: value,
            },
        });
    }

    async update(userId: string, userData: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data: userData,
        });
    }

    async getUserComments({ userId, limit, cursor }: { userId: string; limit?: number; cursor?: Date }) {
        return this.prisma.comment.findMany({
            where: { userId, createdAt: { lt: cursor } },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }

    async getUserPosts({ userId, limit, cursor }: { userId: string; limit?: number; cursor?: Date }) {
        return this.prisma.post.findMany({
            where: { userId, createdAt: { lt: cursor } },
            include: {
                user: true,
                stock: true,
                comments: true,
                postLikes: true,
                postViews: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }
}
