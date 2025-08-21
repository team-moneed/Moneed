import {
    TopBoardPostThumbnail,
    PostThumbnail,
    TopPostThumbnail,
    HotPostThumbnail,
    CreatePostRequest,
    CreatePostResponse,
    DeletePostResponse,
    UpdatePostResponse,
    PostDetail,
    UpdatePostRequest,
    LikePostResponse,
    UnlikePostResponse,
} from '@/types/post';
import { httpWithCredentials, http } from './client';
import { isFile } from '@/utils/typeChecker';

export const getTopBoardPosts = async ({ symbol, limit }: { symbol: string; limit?: number }) => {
    const res = await http.get<TopBoardPostThumbnail[]>(`/api/posts/top/${symbol}`, {
        params: {
            limit,
        },
    });
    return res.data;
};

export const getTopPosts = async ({ limit = 5 }: { limit?: number } = {}) => {
    const res = await http.get<TopPostThumbnail[]>(`/api/posts/top`, {
        params: {
            limit,
        },
    });
    return res.data;
};

export const getHotPosts = async ({ limit = 15, cursor = 0 }: { limit?: number; cursor?: number } = {}) => {
    const res = await http.get<HotPostThumbnail[]>(`/api/posts/hot`, {
        params: {
            limit,
            cursor,
        },
    });
    return res.data;
};

export const getPost = async ({ postId }: { postId: number }) => {
    const res = await http.get<PostDetail>(`/api/posts/${postId}`);
    return res.data;
};

export const getPosts = async ({
    symbol,
    cursor = new Date(),
    limit = 15,
}: {
    symbol: string;
    cursor?: Date;
    limit?: number;
}) => {
    const res = await http.get<PostThumbnail[]>(`/api/posts`, {
        params: {
            symbol,
            cursor,
            limit,
        },
    });
    return res.data;
};

export const createPost = async ({ symbol, title, content, thumbnailImage }: CreatePostRequest) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('symbol', symbol);
    if (thumbnailImage) {
        formData.append('thumbnailImage', thumbnailImage, thumbnailImage.name);
    }

    return await httpWithCredentials.post<CreatePostResponse>(`/api/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deletePost = async ({ postId }: { postId: number }) => {
    return await httpWithCredentials.delete<DeletePostResponse>(`/api/posts/${postId}`);
};

export const updatePost = async ({
    postId,
    title,
    content,
    thumbnailImage,
    prevThumbnailImageUrl,
}: UpdatePostRequest) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (isFile(thumbnailImage)) {
        formData.append('thumbnailImage', thumbnailImage, thumbnailImage.name);
    }
    if (prevThumbnailImageUrl) {
        formData.append('prevThumbnailImageUrl', prevThumbnailImageUrl);
    }
    // 원래 썸네일이 있는 상태에서 추가/교체/삭제 없이 제출한 경우
    if (typeof thumbnailImage === 'string') {
        formData.append('thumbnailImage', thumbnailImage);
    }

    return await httpWithCredentials.put<UpdatePostResponse>(`/api/posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const likePost = async ({ postId }: { postId: number }) => {
    return await httpWithCredentials.post<LikePostResponse>(`/api/posts/${postId}/like`);
};

export const unlikePost = async ({ postId }: { postId: number }) => {
    return await httpWithCredentials.delete<UnlikePostResponse>(`/api/posts/${postId}/like`);
};
