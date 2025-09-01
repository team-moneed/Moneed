import { prisma } from '@/database/client';

class LeaveReasonRepository {
    async createLeaveReason(reason: string) {
        return await prisma.leaveReason.create({ data: { reason } });
    }
}

export default LeaveReasonRepository;
