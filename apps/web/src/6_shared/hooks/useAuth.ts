import { useEffect, useState } from 'react';
import { TOKEN_KEY } from '../config';
import TokenLocalStorage from '../utils/token.localstorage';

export const useAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const accessTokenCookie = TokenLocalStorage.getToken(TOKEN_KEY.ACCESS_TOKEN);
        const refreshTokenCookie = TokenLocalStorage.getToken(TOKEN_KEY.REFRESH_TOKEN);
        setAccessToken(accessTokenCookie);
        setRefreshToken(refreshTokenCookie);
        setIsLoggedIn(TokenLocalStorage.isAuthenticated());
    }, []);

    return { accessToken, refreshToken, isLoggedIn };
};
