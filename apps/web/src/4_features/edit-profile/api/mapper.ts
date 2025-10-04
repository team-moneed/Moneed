import { User, UserDTO } from './type';

export const toUser = (user: UserDTO): User => {
    return {
        id: user.id,
        nickname: user.nickname,
        profileImage: user.profileImage,
    };
};
