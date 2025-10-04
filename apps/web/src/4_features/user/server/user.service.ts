import { PostMapper } from '@/5_entities/post/model';
import { UserRepository } from '@/5_entities/user/server/user.repository';

class UserService {
    private userRepository = new UserRepository();

    async getUserInfo({ userId }: { userId: string }) {
        return this.userRepository.findFirst({ field: 'id', value: userId });
    }

    async getUserPosts({ userId, limit, cursor }: { userId: string; limit?: number; cursor?: Date }) {
        const posts = await this.userRepository.getUserPosts({ userId, limit, cursor });
        return posts.map(post => PostMapper.toPost(post));
    }

    async getUserComments({ userId, limit, cursor }: { userId: string; limit?: number; cursor?: Date }) {
        return this.userRepository.getUserComments({ userId, limit, cursor });
    }

    async isDuplicateNickname({ userId, nickname }: { userId: string; nickname: string }) {
        const user = await this.userRepository.findFirst({ field: 'nickname', value: nickname });
        if (user && user.id !== userId) {
            return true;
        }
        return false;
    }
}

export default UserService;
