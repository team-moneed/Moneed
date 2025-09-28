import { YouTubeSearchResponse } from '@/4_features/update-youtube-shorts/api/type';
import { toShorts } from '@/4_features/update-youtube-shorts/api/mapper';
import axios from 'axios';

const youtube = axios.create({
    baseURL: process.env.YOUTUBE_BASE_URL,
});

youtube.interceptors.request.use(config => {
    return config;
});

youtube.interceptors.response.use(
    async response => {
        return response;
    },
    async error => {
        console.error(error.response?.data);
        return Promise.reject(error);
    },
);

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

    return response.data.items.map(toShorts);
};
