import { getToken } from '@/shared/utils/cookie.browser';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const accessTokenCookie = getToken(process.env.JWT_ACCESS_NAME || 'access_token');
        const refreshTokenCookie = getToken(process.env.JWT_REFRESH_NAME || 'refresh_token');
        setAccessToken(accessTokenCookie);
        setRefreshToken(refreshTokenCookie);
    }, []);

    return { accessToken, refreshToken };
};
