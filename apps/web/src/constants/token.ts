export const TOKEN_KEY = {
    ACCESS_TOKEN: process.env.JWT_ACCESS_NAME || 'access_token',
    REFRESH_TOKEN: process.env.JWT_REFRESH_NAME || 'refresh_token',
} as const;
