import { User } from '@moneed/db/prisma/generated/prisma-client-js';
import { Optional } from '@moneed/utility-types';

export interface UserInfo {
    name: string;
    email: string;
    birthyear: string;
    birthday: string;
}

export type RequiredUserInfo = Optional<User, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'lastLoginAt'>;
