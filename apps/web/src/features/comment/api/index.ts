import { CommentDeleteDTO, CommentUpdateDTO } from '@/features/comment/model/comment.type';
import { http } from '@/shared/api/client';
import { DYNAMIC_API_PATH } from '@/shared/config';
import { Comment } from '@prisma/client';

export const getComments = async ({ postId }: { postId: number }) => {
    const response = await http.get<Comment[]>(DYNAMIC_API_PATH.GET_COMMENTS(postId));
    return response.data;
};

export const deleteComment = async ({ commentId }: { commentId: number }) => {
    const response = await http.delete<CommentDeleteDTO>(DYNAMIC_API_PATH.DELETE_COMMENT(commentId));
    return response.data;
};

export const updateComment = async ({ commentId, content }: { commentId: number; content: string }) => {
    const response = await http.put<CommentUpdateDTO>(DYNAMIC_API_PATH.UPDATE_COMMENT(commentId), {
        content,
    });
    return response.data;
};
