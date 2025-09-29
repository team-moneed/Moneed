import { Comment, CommentDTO } from './comment.type';

export class CommentMapper {
    static toComment(commentDTO: CommentDTO): Comment {
        return {
            id: commentDTO.id,
            content: commentDTO.content,
            createdAt: commentDTO.createdAt,
            updatedAt: commentDTO.updatedAt,
            user: commentDTO.user,
            postId: commentDTO.postId,
        };
    }
}
