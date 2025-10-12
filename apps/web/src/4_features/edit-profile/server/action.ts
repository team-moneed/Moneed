'use server';

import { UserRepository } from '@/5_entities/user/server/user.repository';
import { PATH, REASON_CODES, TOKEN_KEY } from '@/6_shared/config';
import { S3Service } from '@/6_shared/model';
import { urlToS3FileName } from '@/6_shared/utils';
import TokenCookie from '@/6_shared/utils/token.cookie';
import { verifyToken } from '@moneed/auth';
import { EditProfileRepository } from './repository';
import { ResponseError } from '@moneed/utils';
import { redirect } from 'next/navigation';

interface UpdateUserProfileRequest {
    nickname: string;
    profileImageFile: File | null;
    profileImageUrl: string;
}

export const updateUserProfile = async ({
    nickname,
    profileImageFile,
    profileImageUrl,
}: UpdateUserProfileRequest): Promise<void> => {
    // 쿠키 검증
    const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
    const decodedToken = await verifyToken({ jwt: accessToken ?? null, key: process.env.SESSION_SECRET! });
    if (decodedToken.error) {
        throw decodedToken.error;
    }
    const userId = decodedToken.data.id;

    // profileImage가 file이라면
    if (profileImageFile) {
        // 해당 유저의 기존 프로필 이미지 확인
        const userRepository = new UserRepository();
        const user = await userRepository.findById(userId);
        if (user?.profileImage) {
            const s3Service = new S3Service();
            await s3Service.deleteImage(urlToS3FileName(user.profileImage));
        }
        // S3에 업로드
        const s3Service = new S3Service();
        const profileImageUrl = await s3Service.uploadImage('profile', profileImageFile);
        // DB 업데이트
        const editProfileRepository = new EditProfileRepository();
        await editProfileRepository.updateUserProfile(userId, nickname, profileImageUrl);
        redirect(PATH.EDITPROFILE + '?reason=' + REASON_CODES.PROFILE_UPDATED);
    }

    // profileImage가 string이라면
    if (profileImageUrl) {
        // DB 업데이트
        const editProfileRepository = new EditProfileRepository();
        await editProfileRepository.updateUserProfile(userId, nickname, profileImageUrl);
        redirect(PATH.EDITPROFILE + '?reason=' + REASON_CODES.PROFILE_UPDATED);
    }

    throw new ResponseError(400, 'profileImage의 타입이 올바르지 않습니다.');
};
