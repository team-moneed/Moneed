import { CommentRepository } from '@/entities/comment/server';

export class CommentService {
    private commentRepository = new CommentRepository();

    async getPostComments({ postId, limit, cursor }: { postId: number; limit?: number; cursor?: Date }) {
        const comments = await this.commentRepository.getPostComments({ postId, limit, cursor });
        return comments;
    }

    async createComment({ postId, content, userId }: { postId: number; content: string; userId: string }) {
        return this.commentRepository.createComment({ postId, content, userId });
    }

    async deleteComment({ commentId, userId }: { commentId: number; userId: string }) {
        return this.commentRepository.deleteComment({ commentId, userId });
    }

    async updateComment({ commentId, content }: { commentId: number; content: string }) {
        return this.commentRepository.updateComment({ commentId, content });
    }
}
