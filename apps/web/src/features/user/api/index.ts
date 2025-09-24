import type { User } from '@prisma/client';
import { http } from '@/shared/api/client';
import { isFile } from '@/shared/utils/typeChecker';
import type { UpdateUserProfileRequest } from '../model';
import type { CommentWithUserDTO } from '@/features/comment/model/comment.type';
import type { Stock } from '@/entities/stock';
import { API_PATH } from '@/shared/config';
import type { Post } from '@/entities/post';

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

async function updateProfile({ nickname, profileImage, prevProfileImageUrl }: UpdateUserProfileRequest) {
    const formData = new FormData();
    formData.append('nickname', nickname);
    if (isFile(profileImage)) {
        formData.append('profileImage', profileImage, profileImage.name);
    } else if (typeof profileImage === 'string') {
        formData.append('profileImage', profileImage);
    }
    formData.append('prevProfileImageUrl', prevProfileImageUrl);
    const res = await http.put<User>(API_PATH.USER_ME, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
    updateProfile,
    checkDuplicateNickname,
};
