import { User as PrismaUser } from '@prisma/client';
import { Required } from '@moneed/utility-types';

export type User = {
    id: string;
    nickname: string;
    profileImage: string;
};

export type UserDTO = Required<PrismaUser, 'name' | 'email' | 'birthyear' | 'birthday'>;
