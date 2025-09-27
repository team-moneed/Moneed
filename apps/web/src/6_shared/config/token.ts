export const TOKEN_KEY = {
    ACCESS_TOKEN: process.env.NEXT_PUBLIC_JWT_ACCESS_NAME || 'access_token',
    REFRESH_TOKEN: process.env.NEXT_PUBLIC_JWT_REFRESH_NAME || 'refresh_token',
} as const;
