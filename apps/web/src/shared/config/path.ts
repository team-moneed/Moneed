export const PATH = {
    MYPAGE: '/mypage',
    MYPOST: '/mypage/posts',
    MYCOMMENT: '/mypage/comments',
    MYPROFILE: '/mypage/profile',
    SELECTSTOCKTYPE: '/selectstocktype',
    LEAVE: '/leave',
    COMMUNITY: '/community',
    SEARCHSTOCKTYPE: '/searchstocktype',
    WRITEPOST: '/posts/write',
    WELCOME: '/welcome',
    ONBOARDING: '/onboarding',
    EDITPOST: '/posts/:postId/edit',
    HOME: '/',
    SHORTFORM: '/shortform',
    NOTIFICATION: '/notification',
    SMARTTALK: '/smarttalk',
    MYCOMMENT_LEGACY: '/mycomment', // 기존 mycomment 경로
} as const;

export const REGEXP_PATH = {
    EDITPOST: /^\/posts\/[^\/]+\/edit\/?$/,
    MYPAGE: /^\/mypage\/?$/,
    MYPOST: /^\/mypage\/posts\/?$/,
    MYCOMMENT: /^\/mypage\/comments\/?$/,
    MYPROFILE: /^\/mypage\/profile\/?$/,
    SELECTSTOCKTYPE: /^\/selectstocktype\/?$/,
    LEAVE: /^\/leave\/?$/,
    COMMUNITY: /^\/community\/?$/,
    SEARCHSTOCKTYPE: /^\/searchstocktype\/?$/,
    WRITEPOST: /^\/posts\/write\/?$/,
    WELCOME: /^\/welcome\/?$/,
    ONBOARDING: /^\/onboarding\/?$/,
    HOME: /^\/$/,
    SHORTFORM: /^\/shortform\/?$/,
    NOTIFICATION: /^\/notification\/?$/,
    SMARTTALK: /^\/smarttalk\/?$/,
    MYCOMMENT_LEGACY: /^\/mycomment\/?$/,
} as const;

// 동적 경로 생성 함수들
export const DYNAMIC_PATH = {
    COMMUNITY_SYMBOL: (symbol: string) => `/community/${symbol}` as const,
    // COMMUNITY_POST: (symbol: string, postId: number) => `/community/${symbol}/posts/${postId}` as const,
    EDITPOST: (postId: number) => `/posts/${postId}/edit` as const,
    WRITEPOST_SYMBOL: (symbol: string) => `/posts/write/${symbol}` as const,
    SHORTFORM_VIDEO: (videoId: string) => `/shortform/${videoId}` as const,
    POST_DETAIL: (postId: number) => `/posts/${postId}` as const,
} as const;

// API 경로 상수들
export const API_PATH = {
    // User APIs
    USER_ME: '/api/users/me',
    USER_ME_POSTS: '/api/users/me/posts',
    USER_ME_COMMENTS: '/api/users/me/comments',
    USER_NICKNAME_CHECK: '/api/users/nickname/check',

    // Stock APIs
    STOCKS: '/api/stocks',
    STOCKS_SELECTED: '/api/stocks/selected',
    STOCKS_SELECT: '/api/stocks/select',
    STOCKS_PRICE_OVERSEAS: '/api/stocks/price/overseas',
    STOCKS_HOT: '/api/stocks/hot',

    // Post APIs
    POSTS: '/api/posts',
    POSTS_TOP: '/api/posts/top',
    POSTS_HOT: '/api/posts/hot',

    // Comment APIs
    COMMENTS: '/api/comments',

    // OAuth
    OAUTH_TOKEN: '/oauth2/tokenP',
} as const;

export const DYNAMIC_API_PATH = {
    GET_POST: (postId: number) => `${API_PATH.POSTS}/${postId}` as const,
    DELETE_POST: (postId: number) => `${API_PATH.POSTS}/${postId}` as const,
    UPDATE_POST: (postId: number) => `${API_PATH.POSTS}/${postId}` as const,
    LIKE_POST: (postId: number) => `${API_PATH.POSTS}/${postId}/like` as const,
    UNLIKE_POST: (postId: number) => `${API_PATH.POSTS}/${postId}/like` as const,
    GET_COMMENTS: (postId: number) => `${API_PATH.COMMENTS}?postId=${postId}` as const,
    DELETE_COMMENT: (commentId: number) => `${API_PATH.COMMENTS}/${commentId}` as const,
    UPDATE_COMMENT: (commentId: number) => `${API_PATH.COMMENTS}/${commentId}` as const,
} as const;
