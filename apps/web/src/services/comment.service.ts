import CommentRepository from '@/repositories/comment.repository';

export default class CommentService {
    private commentRepository = new CommentRepository();

    async getUserComments({ userId }: { userId: string }) {
        const comments = await this.commentRepository.getUserComments({ userId });
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
