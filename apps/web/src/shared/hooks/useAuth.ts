import { TokenUtils } from '@/shared/utils/tokenUtils';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const accessTokenCookie = TokenUtils.getToken(process.env.NEXT_PUBLIC_JWT_ACCESS_NAME || 'access_token');
        const refreshTokenCookie = TokenUtils.getToken(process.env.NEXT_PUBLIC_JWT_REFRESH_NAME || 'refresh_token');
        setAccessToken(accessTokenCookie);
        setRefreshToken(refreshTokenCookie);
    }, []);

    return { accessToken, refreshToken };
};
