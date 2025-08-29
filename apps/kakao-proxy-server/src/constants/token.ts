import { getAccessTokenCookie, getRefreshTokenCookie } from '@moneed/auth';

export const ACCESS_TOKEN_COOKIE = getAccessTokenCookie(
    process.env.JWT_ACCESS_EXPIRES_IN || '24h',
    process.env.JWT_ACCESS_NAME || 'access_token',
);
export const REFRESH_TOKEN_COOKIE = getRefreshTokenCookie(
    process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    process.env.JWT_REFRESH_NAME || 'refresh_token',
);
