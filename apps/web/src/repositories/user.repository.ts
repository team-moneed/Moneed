import { prisma } from '@/database/client';
import { User } from '@prisma/client';

export class UserRepository {
    private prisma = prisma;

    async findFirst({ field, value }: { field: 'id' | 'nickname'; value: string }): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                [field]: value,
            },
        });
    }

    async update(userId: string, userData: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data: userData,
        });
    }
}
