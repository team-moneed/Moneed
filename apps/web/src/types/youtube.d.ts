// YouTube API 응답 타입 정의

export interface YouTubeSearchResponse {
    kind: string;
    etag: string;
    nextPageToken: string;
    regionCode: string;
    pageInfo: YouTubePageInfo;
    items: YouTubeSearchResult[];
}

export interface YouTubePageInfo {
    totalResults: number;
    resultsPerPage: number;
}

export interface YouTubeSearchResult {
    kind: string;
    etag: string;
    id: YouTubeResourceId;
    snippet: YouTubeSnippet;
}

export interface YouTubeResourceId {
    kind: string;
    videoId: string;
}

export interface YouTubeSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
}

export interface YouTubeThumbnails {
    default: YouTubeThumbnail;
    medium: YouTubeThumbnail;
    high: YouTubeThumbnail;
}

export interface YouTubeThumbnail {
    url: string;
    width: number;
    height: number;
}

// 비디오 상세 정보 타입 (필요시 확장)
export interface YouTubeVideoDetails {
    kind: string;
    etag: string;
    id: string;
    snippet: YouTubeSnippet;
    contentDetails?: {
        duration: string;
        dimension: string;
        definition: string;
        caption: string;
        licensedContent: boolean;
        contentRating: Record<string, any>;
        projection: string;
    };
    statistics?: {
        viewCount: string;
        likeCount: string;
        dislikeCount: string;
        favoriteCount: string;
        commentCount: string;
    };
}

// 채널 정보 타입 (필요시 확장)
export interface YouTubeChannelDetails {
    kind: string;
    etag: string;
    id: string;
    snippet: {
        title: string;
        description: string;
        customUrl: string;
        publishedAt: string;
        thumbnails: YouTubeThumbnails;
        defaultLanguage: string;
        localized: {
            title: string;
            description: string;
        };
        country: string;
    };
    statistics?: {
        viewCount: string;
        subscriberCount: string;
        hiddenSubscriberCount: boolean;
        videoCount: string;
    };
}
