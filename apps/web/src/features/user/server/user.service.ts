import { PostMapper } from '@/entities/post/model';
import { UserRepository } from '@/entities/user/server/user.repository';
import { S3Service } from '@/shared/model';
import { urlToS3FileName, isFile } from '@/shared/utils';
import type { UpdateUserProfileRequest } from '@/features/user';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/shared/config';

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

    async updateUserProfile({
        userId,
        nickname,
        profileImage,
        prevProfileImageUrl,
    }: UpdateUserProfileRequest & { userId: string }) {
        const s3Service = new S3Service();
        const isDuplicate = await this.isDuplicateNickname({ userId, nickname });
        if (isDuplicate) {
            throw new ResponseError(409, ERROR_MSG.DUPLICATE_NICKNAME);
        }

        let profileImageUrl: string | undefined;
        if (profileImage && prevProfileImageUrl) {
            // 프로필 이미지 교체
            if (isFile(profileImage)) {
                profileImageUrl = await s3Service.uploadImage('profile', profileImage);
                await s3Service.deleteImage(urlToS3FileName(prevProfileImageUrl));
            }
            // 프로필 이미지 유지 (이미 프로필 이미지가 있던 상태)
            else if (typeof profileImage === 'string') {
                profileImageUrl = undefined;
            }
        } else if (profileImage && !prevProfileImageUrl) {
            // 프로필 이미지 추가
            if (isFile(profileImage)) {
                profileImageUrl = await s3Service.uploadImage('profile', profileImage);
            }
        }
        return this.userRepository.update(userId, { nickname, profileImage: profileImageUrl });
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
