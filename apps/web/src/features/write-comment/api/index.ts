import { http } from '@/shared/api/client';
import { API_PATH } from '@/shared/config';

type CommentCreateDTO = {
    message: string;
};

export const createComment = async ({ postId, content }: { postId: number; content: string }) => {
    const response = await http.post<CommentCreateDTO>(API_PATH.COMMENTS, { postId, content });
    return response.data;
};
