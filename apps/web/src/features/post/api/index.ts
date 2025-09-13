import { API_PATH } from '@/shared/config';
import { http } from '@/shared/api/client';
import { CreatePostRequestDTO, CreatePostResponse, PostDTO, PostMapper } from '@/entities/post';
import {
    DeletePostResponse,
    UpdatePostRequest,
    UpdatePostResponse,
    LikePostResponse,
    UnlikePostResponse,
} from '@/features/post/model/post.type';
import { isFile } from '@/shared/utils/typeChecker';
import { DYNAMIC_API_PATH } from '@/shared/config/path';
import { CommentDTO, CommentMapper } from '@/entities/comment';

export const fetchHotPosts = async ({
    limit = 15,
    cursor = 0,
    userId,
}: { limit?: number; cursor?: number; userId?: string } = {}) => {
    const res = await http.get<PostDTO[]>(API_PATH.POSTS_HOT, {
        params: {
            limit,
            cursor,
        },
    });
    return res.data.map(post => PostMapper.toPost(post, userId));
};

export const fetchTopBoardPosts = async ({
    symbol,
    limit,
    userId,
}: {
    symbol: string;
    limit?: number;
    userId?: string;
}) => {
    const res = await http.get<PostDTO[]>(`${API_PATH.POSTS_TOP}/${symbol}`, {
        params: {
            limit,
        },
    });
    return res.data.map(post => PostMapper.toPost(post, userId));
};

export const fetchTopPosts = async ({ limit = 5, userId }: { limit?: number; userId?: string } = {}) => {
    const res = await http.get<PostDTO[]>(API_PATH.POSTS_TOP, {
        params: {
            limit,
        },
    });
    return res.data.map(post => PostMapper.toPost(post, userId));
};

export const fetchPost = async ({ postId, userId }: { postId: number; userId?: string }) => {
    const res = await http.get<PostDTO>(DYNAMIC_API_PATH.GET_POST(postId));
    return PostMapper.toPost(res.data, userId);
};

export const fetchPosts = async ({
    symbol,
    cursor = new Date(), // 날짜 기준
    limit = 15,
    userId,
}: {
    symbol: string;
    cursor?: Date;
    limit?: number;
    userId?: string;
}) => {
    const res = await http.get<PostDTO[]>(API_PATH.POSTS, {
        params: {
            symbol,
            cursor,
            limit,
        },
    });
    return res.data.map(post => PostMapper.toPost(post, userId));
};

export const createPost = async ({ symbol, title, content, thumbnailImage }: CreatePostRequestDTO) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('symbol', symbol);
    if (thumbnailImage) {
        formData.append('thumbnailImage', thumbnailImage, thumbnailImage.name);
    }

    return http.post<CreatePostResponse>(API_PATH.POSTS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deletePost = async ({ postId }: { postId: number }) => {
    return await http.delete<DeletePostResponse>(DYNAMIC_API_PATH.DELETE_POST(postId));
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

    return await http.put<UpdatePostResponse>(DYNAMIC_API_PATH.UPDATE_POST(postId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const likePost = async ({ postId }: { postId: number }) => {
    return await http.post<LikePostResponse>(DYNAMIC_API_PATH.LIKE_POST(postId));
};

export const unlikePost = async ({ postId }: { postId: number }) => {
    return await http.delete<UnlikePostResponse>(DYNAMIC_API_PATH.UNLIKE_POST(postId));
};

export const fetchPostComments = async ({ postId }: { postId: number }) => {
    const response = await http.get<CommentDTO[]>(DYNAMIC_API_PATH.GET_COMMENTS(postId));
    return response.data.map(CommentMapper.toComment);
};
