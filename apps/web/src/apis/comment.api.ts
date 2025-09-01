import { CommentCreateResponse, CommentDeleteResponse, CommentUpdateResponse } from '@/types/comment';
import { httpWithCredentials } from './client';

export const createComment = async ({ postId, content }: { postId: number; content: string }) => {
    const response = await httpWithCredentials.post<CommentCreateResponse>('/api/comments', { postId, content });
    return response.data;
};

export const deleteComment = async ({ commentId }: { commentId: number }) => {
    const response = await httpWithCredentials.delete<CommentDeleteResponse>(`/api/comments/${commentId}`);
    return response.data;
};

export const updateComment = async ({ commentId, content }: { commentId: number; content: string }) => {
    const response = await httpWithCredentials.put<CommentUpdateResponse>(`/api/comments/${commentId}`, { content });
    return response.data;
};
