// import { REASON_CODES } from '@/constants/snackbar';
import { ERROR_MSG } from '@/constants/message';
import axios from 'axios';
import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logout, refresh } from './auth.api';
import { getAccessToken, getRefreshToken, clearTokens, setTokens } from '@/utils/localStorage.browser';

const getMoneedInstance = (): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
        withCredentials: true,
        baseURL: process.env.NEXT_PUBLIC_MONEED_BASE_URL,
        headers: {
            'Content-type': 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            return config;
        },
        (error: AxiosError) => {
            console.error(error.response?.data);
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError) => {
            console.error(error.response?.data);
            return Promise.reject(error);
        },
    );

    return instance;
};

const withCredentials = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            // 로컬스토리지에서 액세스 토큰 가져와서 헤더에 추가
            const accessToken = getAccessToken();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error: AxiosError) => {
            console.error(error.response?.data);
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        async (error: AxiosError) => {
            if (error.response?.status === 401) {
                try {
                    // 리프레쉬 토큰으로 새 토큰 발급 시도
                    const refreshTokenValue = getRefreshToken();
                    if (!refreshTokenValue) {
                        throw new Error('No refresh token available');
                    }

                    const refreshResponse = await refresh({
                        provider: 'kakao',
                        refreshToken: refreshTokenValue,
                    });

                    // 새 토큰들을 로컬스토리지와 쿠키에 저장
                    if (refreshResponse.data?.access_token && refreshResponse.data?.refresh_token) {
                        await setTokens(refreshResponse.data.access_token, refreshResponse.data.refresh_token);

                        // 원래 요청에 새 토큰으로 재시도
                        if (error.config) {
                            error.config.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
                            return instance.request(error.config);
                        }
                    }
                } catch {
                    // 리프레쉬 실패 시 로그아웃 처리
                    await clearTokens();
                    await logout({ provider: 'kakao' });
                    return Promise.reject(new AxiosError(ERROR_MSG.TOKEN_EXPIRED));
                    // TODO: onboarding 페이지로 리다이렉트
                }
            }

            if (error.response?.status === 403) {
                // 리프레쉬 토큰도 만료된 경우
                await clearTokens();
                await logout({ provider: 'kakao' });
                return Promise.reject(new AxiosError(ERROR_MSG.TOKEN_EXPIRED));
                // TODO: onboarding 페이지로 리다이렉트
            }
            return Promise.reject(error);
        },
    );
    return instance;
};

const getProxyInstance = (): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
        withCredentials: true,
        baseURL: process.env.NEXT_PUBLIC_KAKAO_PROXY_SERVER,
        headers: {
            'Content-type': 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            return config;
        },
        (error: AxiosError) => {
            console.error(error.response?.data);
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError) => {
            console.error(error.response?.data);
            return Promise.reject(error);
        },
    );

    return instance;
};

export const proxy = getProxyInstance();
export const proxyWithCredentials = withCredentials(getProxyInstance());
export const http = getMoneedInstance();
export const httpWithCredentials = withCredentials(getMoneedInstance());
