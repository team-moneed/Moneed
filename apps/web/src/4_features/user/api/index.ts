import type { User } from '@prisma/client';
import { http } from '@/6_shared/api/client';
import type { CommentWithUserDTO } from '@/4_features/comment/model/comment.type';
import type { Stock } from '@/5_entities/stock';
import { API_PATH } from '@/6_shared/config';
import type { Post } from '@/5_entities/post';

async function fetchInfo() {
    const res = await http.get<User>(API_PATH.USER_ME);
    return res.data;
}

async function fetchPosts() {
    const res = await http.get<Post[]>(API_PATH.USER_ME_POSTS);
    return res.data;
}

async function fetchComments() {
    const res = await http.get<CommentWithUserDTO[]>(API_PATH.USER_ME_COMMENTS);
    return res.data;
}

async function fetchStocks({ count = 20, cursor = 0 }: { count?: number; cursor?: number } = {}) {
    const res = await http.get<Stock[]>(API_PATH.STOCKS_SELECTED, {
        params: { count, cursor },
    });
    return res.data;
}

async function checkDuplicateNickname({ nickname }: { nickname: string }) {
    const res = await http.post<{ message: string; nickname: string }>(API_PATH.USER_NICKNAME_CHECK, {
        nickname,
    });
    return res.data;
}

export const userApi = {
    fetchInfo,
    fetchPosts,
    fetchComments,
    fetchStocks,
    checkDuplicateNickname,
};
