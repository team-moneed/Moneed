import type { Comment, User, Post, Stock } from '@prisma/client';

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
