export const TOKEN_KEY = {
    ACCESS_TOKEN: process.env.NEXT_PUBLIC_ACCESS_TOKEN || 'access_token',
    REFRESH_TOKEN: process.env.NEXT_PUBLIC_REFRESH_TOKEN || 'refresh_token',
} as const;
