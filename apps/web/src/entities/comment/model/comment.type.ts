import { User } from '@/entities/user/@x/comment.type';

export type CommentDTO = {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    postId: number;
};

export type Comment = {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    postId: number;
};
