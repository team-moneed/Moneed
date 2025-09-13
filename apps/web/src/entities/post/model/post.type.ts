import { Stock } from '@/entities/stock/@x/post.type';
import { User } from '@/entities/user/@x/post.type';
import { PostLike, PostViews } from '@prisma/client';

// 프론트엔드 엔티티 (도메인 모델)
export type Post = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    stock: Stock;
    author: User;
    thumbnailImage: string | null;
    score: number;
    isLiked: boolean;
    isViewed: boolean;
    likes: number;
    views: number;
};

// 서버에서 받는 DTO
export type PostDTO = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;
    stock: Stock;
    user: User;
    thumbnailImage: string | null;
    score: number;
    postLikes: PostLike[];
    postViews: PostViews[];
};

export type CreatePostForm = {
    title: string;
    content: string;
    symbol: string;
    thumbnailImage?: File | null;
};

export type CreatePostRequestDTO = {
    symbol: string;
    title: string;
    content: string;
    thumbnailImage?: File | null;
};

export type CreatePostResponse = {
    message: string;
    post: PostDTO;
};
