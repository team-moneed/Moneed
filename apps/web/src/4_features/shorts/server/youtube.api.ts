import { youtube } from '@/6_shared/api/server';
import { YouTubeSearchResponse } from '@/4_features/shorts/server/youtube.type';

export const searchShorts = async ({ q, count, page }: { q: string; count: number; page: string | null }) => {
    const response = await youtube.get<YouTubeSearchResponse>('/v3/search', {
        params: {
            part: 'snippet',
            q,
            type: 'video',
            videoDuration: 'short',
            maxResults: count,
            pageToken: page,
            key: process.env.YOUTUBE_API_KEY,
        },
    });

    return response;
};
