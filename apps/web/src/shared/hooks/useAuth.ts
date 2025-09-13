import { getAccessToken, getRefreshToken } from '@/shared/utils/token';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const accessTokenCookie = getAccessToken();
        const refreshTokenCookie = getRefreshToken();
        setAccessToken(accessTokenCookie);
        setRefreshToken(refreshTokenCookie);
    }, []);

    return { accessToken, refreshToken };
};
