import { YouTubeSearchResponse } from '@/4_features/shorts/server/youtube.type';

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

export const toUSD = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};
