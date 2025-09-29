export type Shorts = {
    id: number;
    videoId: string;
    title: string;
    thumbnailImage: {
        default: ThumbnailImage;
        medium: ThumbnailImage;
        high: ThumbnailImage;
    };
    createdAt: Date;
    updatedAt: Date;
};

export type ThumbnailImage = {
    url: string;
    width: number;
    height: number;
};
