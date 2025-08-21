import { DecodedToken } from '@/types/auth';
import { decodeJwt } from 'jose';
import { getCookie } from '@/utils/cookie';

export const decodeToken = (token?: string): DecodedToken | null => {
    const accessToken = token || getCookie('access_token');
    if (!accessToken) return null;

    return decodeJwt<DecodedToken>(accessToken);
};

export const isTokenExpired = (token?: string): boolean => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return true;

    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
};
