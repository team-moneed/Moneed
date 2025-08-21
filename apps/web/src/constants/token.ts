// 토큰 만료 기간 (밀리초)
export const TOKEN_EXPIRATION = {
    ACCESS_TOKEN: 24 * 60 * 60 * 1000, // 24시간
    REFRESH_TOKEN: 30 * 24 * 60 * 60 * 1000, // 30일
} as const;

export const TOKEN_ERROR = {
    INVALID_TOKEN: 'Invalid token',
    USER_NOT_FOUND: 'User not found',
    EXPIRED_TOKEN: 'Expired token',
    NOT_FOUND_TOKEN: 'Not found token',
} as const;

export const TOKEN_KEY = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
} as const;
