import { prisma } from '@/6_shared/model';
import { Shorts } from '@/4_features/update-youtube-shorts/api/type';

export default class UpdateShortsRepository {
    static async upsertShorts(shorts: Shorts[]) {
        prisma.$transaction(async tx => {
            await tx.shorts.deleteMany({});

            for (const short of shorts) {
                await tx.shorts.upsert({
                    where: {
                        videoId: short.videoId,
                    },
                    update: {
                        title: short.title,
                        thumbnailImage: short.thumbnailImage,
                    },
                    create: {
                        videoId: short.videoId,
                        title: short.title,
                        thumbnailImage: short.thumbnailImage,
                    },
                });
            }
        });
    }
}
