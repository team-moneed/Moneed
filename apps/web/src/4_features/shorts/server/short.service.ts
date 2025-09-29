import { ShortRepository } from '@/4_features/shorts/server/short.repository';

export class ShortService {
    private readonly shortRepository = new ShortRepository();

    async getInfiniteShorts({ cursor, limit }: { cursor: string | null; limit: number }) {
        if (cursor === null) {
            return await this.shortRepository.getShorts({ count: limit });
        }
        const shorts = await this.shortRepository.getShortsId(cursor);
        return await this.shortRepository.getShortsWithCursor({ count: limit, cursor: shorts!.id });
    }

    async getSingleShorts({ videoId }: { videoId: string }) {
        return await this.shortRepository.getShortByVideoId({ videoId });
    }
}
