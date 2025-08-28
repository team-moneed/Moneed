import { KakaoRefreshTokenResponse, KakaoTokenResponse, KakaoUserInfo } from '@/types/kakao';
import axios, { AxiosError } from 'axios';

const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
const kakaoLogoutUrl = 'https://kapi.kakao.com/v1/user/logout';
const kakaoLeaveUrl = 'https://kapi.kakao.com/v1/user/unlink';

export const getKakaoToken = async (code: string) => {
    try {
        const data = {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_CLIENT_ID,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code,
            client_secret: process.env.KAKAO_CLIENT_SECRET,
        };

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        };

        const res = await axios.post<KakaoTokenResponse>(kakaoTokenUrl, data, {
            headers,
        });
        return res.data;
    } catch (error) {
        console.error('Failed to get Kakao token:', (error as AxiosError).response?.data);
        throw error;
    }
};

export const refreshKakaoToken = async (refreshToken: string) => {
    const data = {
        grant_type: 'refresh_token',
        client_id: process.env.KAKAO_CLIENT_ID,
        refresh_token: refreshToken,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
    };

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const res = await axios.post<KakaoRefreshTokenResponse>(kakaoTokenUrl, data, {
        headers,
    });
    return res.data;
};

export const getKakaoUserInfo = async (accessToken: string) => {
    try {
        const res = await axios.get<KakaoUserInfo>(kakaoUserInfoUrl, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Failed to get Kakao user info:', (error as AxiosError).response?.data);
        throw error;
    }
};

export const logoutKakao = async ({ accessToken, providerUserId }: { accessToken: string; providerUserId: string }) => {
    try {
        const res = await axios.post(
            kakaoLogoutUrl,
            {
                target_id_type: 'user_id',
                target_id: BigInt(providerUserId),
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.error('Failed to logout with Kakao:', (error as AxiosError).response?.data);
        throw error;
    }
};

export const leaveKakao = async ({ accessToken, providerUserId }: { accessToken: string; providerUserId: string }) => {
    try {
        const res = await axios.post<{ id: bigint }>(
            kakaoLeaveUrl,
            {
                target_id_type: 'user_id',
                target_id: BigInt(providerUserId),
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.error('Failed to leave with Kakao:', (error as AxiosError).response?.data);
        throw error;
    }
};
