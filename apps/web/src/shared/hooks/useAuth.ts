import { TokenUtils } from '@/shared/utils/tokenUtils';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const accessTokenCookie = TokenUtils.getAccessToken();
        const refreshTokenCookie = TokenUtils.getRefreshToken();
        setAccessToken(accessTokenCookie);
        setRefreshToken(refreshTokenCookie);
    }, []);

    return { accessToken, refreshToken };
};
