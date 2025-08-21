import PostRepository from '@/repositories/post.repository';
import CommentRepository from '@/repositories/comment.repository';
import { UserRepository } from '@/repositories/user.repository';
import { isFile } from '@/utils/typeChecker';
import S3Service from './s3.service';
import { urlToS3FileName } from '@/utils/parser';
import { UpdateUserProfileRequest } from '@/types/user';

class UserService {
    private userRepository = new UserRepository();
    private postRepository = new PostRepository();
    private commentRepository = new CommentRepository();

    async getUserInfo({ userId }: { userId: string }) {
        return this.userRepository.findById(userId);
    }

    async getUserPosts({ userId }: { userId: string }) {
        return this.postRepository.getUserPosts({ userId });
    }

    async getUserComments({ userId }: { userId: string }) {
        return this.commentRepository.getUserComments({ userId });
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
            throw new Error('이미 존재하는 닉네임입니다.');
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
        const user = await this.userRepository.findByNickname(nickname);
        if (user && user.id !== userId) {
            return true;
        }
        return false;
    }
}

export default UserService;
