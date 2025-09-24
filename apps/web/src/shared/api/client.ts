import { REASON_CODES } from '@/shared/config/snackbar';
import { ERROR_MSG } from '@/shared/config/message';
import axios, { AxiosRequestConfig } from 'axios';
import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenUtils } from '@/shared/utils/tokenUtils';
import { TOKEN_KEY } from '../config';
import useUserStore from '@/entities/user/model/user.store';

const moneedBaseConfig = {
    withCredentials: true,
    baseURL: process.env.NEXT_PUBLIC_MONEED_BASE_URL,
    headers: {
        'Content-type': 'application/json',
    },
};

const proxyBaseConfig = {
    withCredentials: true,
    baseURL: process.env.NEXT_PUBLIC_KAKAO_PROXY_SERVER,
    headers: {
        'Content-type': 'application/json',
    },
};

const getAxiosInstance = (config: AxiosRequestConfig): AxiosInstance => {
    const instance: AxiosInstance = axios.create(config);

    // 요청 인터셉터: 액세스 토큰을 헤더에 자동 추가
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const accessToken = TokenUtils.getToken(TOKEN_KEY.ACCESS_TOKEN);
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error: AxiosError) => {
            console.error('Request interceptor error:', error.response?.data);
            return Promise.reject(error);
        },
    );

    // 응답 인터셉터: 토큰 만료 시 자동 갱신 및 재시도
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        async (error: AxiosError) => {
            // 토큰 갱신이 필요한 에러인지 확인
            if (error.response?.status === 401) {
                try {
                    const { access_token } = await TokenUtils.refreshToken();
                    const originalRequest = error.config!;
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return instance.request(originalRequest);
                } catch (retryError) {
                    console.error(ERROR_MSG.TOKEN_REFRESH_FAILED, retryError);
                    useUserStore.getState().clearUser();
                    window.location.href = `/onboarding?reason=${REASON_CODES.EXPIRED_SESSION}`;
                }
            }

            return Promise.reject(error);
        },
    );

    return instance;
};

export const proxy = getAxiosInstance(proxyBaseConfig);
export const http = getAxiosInstance(moneedBaseConfig);
