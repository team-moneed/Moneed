import 'server-only';
import { prisma } from '@/6_shared/model';

export class CommentRepository {
    private prisma = prisma;

    async getPostComments({ postId, limit, cursor }: { postId: number; limit?: number; cursor?: Date }) {
        return this.prisma.comment.findMany({
            where: { postId, createdAt: { lt: cursor } },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }

    async createComment({ postId, content, userId }: { postId: number; content: string; userId: string }) {
        return this.prisma.comment.create({
            data: { postId, content, userId },
        });
    }

    async deleteComment({ commentId, userId }: { commentId: number; userId: string }) {
        return this.prisma.comment.delete({
            where: { id: commentId, userId },
        });
    }

    async updateComment({ commentId, content }: { commentId: number; content: string }) {
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { content },
        });
    }
}
