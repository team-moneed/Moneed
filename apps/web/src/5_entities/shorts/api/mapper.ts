import { Shorts as PrismaShorts } from '@prisma/client';
import type { Shorts } from './type';

type ShortsDTO = PrismaShorts;

export const toShorts = (short: ShortsDTO): Shorts => {
    return {
        id: short.id,
        videoId: short.videoId,
        title: short.title,
        thumbnailImage: JSON.parse(short.thumbnailImage) as Shorts['thumbnailImage'],
        createdAt: short.createdAt,
        updatedAt: short.updatedAt,
    };
};
