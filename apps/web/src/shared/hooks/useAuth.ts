import { getCookie } from '@/shared/utils/cookie.browser';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
    const [refreshToken, setRefreshToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        const accessTokenCookie = getCookie(process.env.JWT_ACCESS_NAME || 'access_token');
        const refreshTokenCookie = getCookie(process.env.JWT_REFRESH_NAME || 'refresh_token');
        setAccessToken(accessTokenCookie);
        setRefreshToken(refreshTokenCookie);
    }, []);

    return { accessToken, refreshToken };
};
