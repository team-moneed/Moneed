import { type User } from '@moneed/db/generated';
import { prisma } from '@moneed/db';

export class UserRepository {
    private prisma = prisma;

    async findFirst({ field, value }: { field: 'id' | 'nickname'; value: string }): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                [field]: value,
            },
        });
    }

    async update(userId: string, userData: Partial<User>) {
        return this.prisma.user.update({
            where: { id: userId },
            data: userData,
        });
    }
}
