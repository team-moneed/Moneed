// TODO: 해당 파일 제거하기 (쿠키 httpOnly로 변경, 클라이언트에서는 로컬스토리지 이용)
import { DecodedToken } from '@moneed/auth';
import { decodeJwt } from 'jose';

export const getToken = (key: string) => {
    const cookie = localStorage.getItem(key);
    return cookie;
};

export const decodeToken = (token?: string): DecodedToken | null => {
    const accessToken = token || getToken('access_token');
    if (!accessToken) return null;

    return decodeJwt<DecodedToken>(accessToken);
};

export const isTokenExpired = (token?: string): boolean => {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return true;

    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
};
