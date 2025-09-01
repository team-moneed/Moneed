import { prisma } from '@/database/client';

export default class CommentRepository {
    private prisma = prisma;

    async getUserComments({ userId }: { userId: string }) {
        return this.prisma.comment.findMany({
            where: { userId },
            include: {
                user: true,
                post: {
                    include: {
                        stock: true,
                    },
                },
            },
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
