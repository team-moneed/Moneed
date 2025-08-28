// import { REASON_CODES } from '@/constants/snackbar';
import { ERROR_MSG } from '@/constants/message';
import axios from 'axios';
import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logout, refresh } from './auth.api';

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
                // TODO: 주석 제거 -> 커뮤니티 페이지 StockTypeBar 수정 (유저, 게스트 UI 명확히 분리)
                // window.location.href = `/onboarding?reason=${REASON_CODES.EXPIRED_SESSION}`;
                const { data } = await refresh({ provider: 'kakao' });
                return instance.request(error.config);
            }

            if (error.response?.status === 403) {
                await logout({ provider: 'kakao' });
                return Promise.reject(new AxiosError(ERROR_MSG.TOKEN_EXPIRED));
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
