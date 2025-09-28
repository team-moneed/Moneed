import { ShortRepository } from '@/4_features/shorts/server/short.repository';

export class ShortService {
    private readonly shortRepository = new ShortRepository();

    async getShorts({ cursor, limit }: { cursor: string | null; limit: number }) {
        return await this.shortRepository.getShorts({ cursor, limit });
    }

    async getShortByVideoId({ videoId }: { videoId: string }) {
        return await this.shortRepository.getShortByVideoId({ videoId });
    }
}
