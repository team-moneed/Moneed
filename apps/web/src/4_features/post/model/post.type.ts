export type DeletePostResponse = {
    message: string;
    stockSymbol: string;
    postId: number;
};

export type UpdatePostRequest = {
    postId: number;
    title: string;
    content: string;
    thumbnailImage: File | string | null;
    prevThumbnailImageUrl: string | null;
};

export type UpdatePostResponse = {
    message: string;
    stockSymbol: string;
    postId: number;
};

export type LikePostResponse = {
    message: string;
};

export type UnlikePostResponse = {
    message: string;
};
