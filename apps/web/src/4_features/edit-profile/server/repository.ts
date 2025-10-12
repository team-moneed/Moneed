import { prisma } from '@/6_shared/model';

export class EditProfileRepository {
    async updateUserProfile(userId: string, nickname: string, profileImageUrl: string) {
        return await prisma.user.update({
            where: { id: userId },
            data: { nickname, profileImage: profileImageUrl },
        });
    }
}
