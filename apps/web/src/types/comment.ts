import type { Comment, User, Post, Stock } from '@/generated/prisma-client-js';

export type CommentDeleteResponse = {
    message: string;
};

export type CommentUpdateResponse = {
    message: string;
};

export type CommentCreateResponse = {
    message: string;
};

export type CommentWithUser = Comment & {
    user: User;
    post: Post & {
        stock: Stock;
    };
};
