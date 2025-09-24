import type { Comment, User, Post, Stock } from '@prisma/client';

export type CommentDeleteDTO = {
    message: string;
};

export type CommentUpdateDTO = {
    message: string;
};

export type CommentWithUserDTO = Comment & {
    user: User;
    post: Post & {
        stock: Stock;
    };
};
