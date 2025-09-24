import 'server-only';
import { prisma } from '@/shared/model';
import { Shorts } from '@prisma/client';

export class ShortRepository {
    private readonly prisma = prisma;

    async upsertShorts({ shorts }: { shorts: Shorts[] }) {
        for (const short of shorts) {
            await this.prisma.shorts.upsert({
                where: {
                    videoId: short.videoId,
                },
                update: {
                    title: short.title,
                },
                create: {
                    videoId: short.videoId,
                    title: short.title,
                },
            });
        }
    }

    async getShorts({ cursor, limit }: { cursor: string | null; limit: number }) {
        if (!cursor) {
            return await this.prisma.shorts.findMany({
                orderBy: {
                    id: 'asc',
                },
                take: limit,
            });
        }

        const startRecord = await this.prisma.shorts.findFirst({
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

        return await this.prisma.shorts.findMany({
            where: {
                id: {
                    gt: startRecord.id,
                },
            },
            orderBy: {
                id: 'asc',
            },
            take: limit,
        });
    }

    async getShortByVideoId({ videoId }: { videoId: string }) {
        return await this.prisma.shorts.findUnique({
            where: {
                videoId,
            },
        });
    }
}
