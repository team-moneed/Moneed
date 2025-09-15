import { TokenUtils } from '@/shared/utils/tokenUtils';
import { useEffect, useState } from 'react';
import { TOKEN_KEY } from '../config';

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const accessTokenCookie = TokenUtils.getToken(TOKEN_KEY.ACCESS_TOKEN);
        const refreshTokenCookie = TokenUtils.getToken(TOKEN_KEY.REFRESH_TOKEN);
        setAccessToken(accessTokenCookie);
        setRefreshToken(refreshTokenCookie);
    }, []);

    return { accessToken, refreshToken };
};
