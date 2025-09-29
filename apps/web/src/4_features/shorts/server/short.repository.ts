import 'server-only';
import { prisma } from '@/6_shared/model';

export class ShortRepository {
    async getShorts({ cursor, limit }: { cursor: string | null; limit: number }) {
        if (!cursor) {
            return await prisma.shorts.findMany({
                orderBy: {
                    id: 'desc',
                },
                take: limit,
            });
        }

        const startRecord = await prisma.shorts.findFirst({
            where: {
                videoId: cursor,
            },
            select: {
                id: true,
            },
        });

        if (!startRecord) {
            return [];
        }

        return await prisma.shorts.findMany({
            where: {
                id: {
                    gt: startRecord.id,
                },
            },
            orderBy: {
                id: 'desc',
            },
            take: limit,
        });
    }

    async getShortByVideoId({ videoId }: { videoId: string }) {
        return await prisma.shorts.findUnique({
            where: {
                videoId,
            },
        });
    }
}
