import { Shorts as PrismaShorts } from '@prisma/client';
import { Shorts } from './type';

// 서버에서 사용할 타입들
type ShortsDTO = PrismaShorts;
// 클라이언트에서 사용할 타입

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
