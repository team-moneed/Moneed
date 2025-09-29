'use server';

import { prisma } from '@/6_shared/model';

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
