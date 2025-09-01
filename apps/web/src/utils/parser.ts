import { YouTubeSearchResponse } from '@/types/youtube';

export const urlToS3FileName = (url: string) => {
    return new URL(url).pathname.slice(1);
};

export const parseShorts = (shorts: YouTubeSearchResponse) => {
    return shorts.items.map(short => {
        return {
            videoId: short.id.videoId,
            title: short.snippet.title,
        };
    });
};
