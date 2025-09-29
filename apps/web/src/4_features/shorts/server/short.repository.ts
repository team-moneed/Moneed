import 'server-only';
import { prisma } from '@/6_shared/model';

export class ShortRepository {
    async getShorts({ count }: { count: number }) {
        return await prisma.shorts.findMany({
            orderBy: {
                id: 'desc',
            },
            take: count,
        });
    }

    async getShortsWithCursor({ count, cursor }: { count: number; cursor: number }) {
        return await prisma.shorts.findMany({
            where: {
                id: { lt: cursor },
            },
            orderBy: {
                id: 'desc',
            },
            take: count,
        });
    }

    async getShortByVideoId({ videoId }: { videoId: string }) {
        return await prisma.shorts.findUnique({
            where: {
                videoId,
            },
        });
    }

    async getShortsId(videoId: string) {
        return await prisma.shorts.findUnique({
            where: {
                videoId,
            },
            select: {
                id: true,
            },
        });
    }
}
