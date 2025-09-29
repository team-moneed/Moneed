import { Shorts, YoutubeVideoItem } from './type';

type ShortsDTO = YoutubeVideoItem;

export const toShorts = (short: ShortsDTO): Shorts => {
    return {
        videoId: short.id.videoId,
        title: short.snippet.title,
        thumbnailImage: JSON.stringify(short.snippet.thumbnails),
    };
};
