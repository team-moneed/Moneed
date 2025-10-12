import { User as UserPrisma } from '@prisma/client';

export interface UpdateUserProfileRequest {
    nickname: string;
    profileImage: File | string;
}

export type UserDTO = UserPrisma;

export type User = {
    id: string;
    nickname: string;
    profileImage: string;
};
