import { User } from '@/generated/prisma';
import { Optional } from '@/types/util';

export interface UserInfo {
    name: string;
    email: string;
    birthyear: string;
    birthday: string;
}

export type RequiredUserInfo = Optional<User, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'lastLoginAt'>;

export interface UpdateUserProfileRequest {
    nickname: string;
    profileImage: File | string;
    prevProfileImageUrl: string;
}
