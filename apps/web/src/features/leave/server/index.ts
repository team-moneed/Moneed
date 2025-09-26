'use server';

import { prisma } from '@/shared/model';

export const submitLeaveReason = async (reason: string) => {
    await prisma.leaveReason.create({
        data: {
            reason,
        },
    });

    return {
        success: true,
        message: '탈퇴 사유가 제출되었습니다.',
    };
};
