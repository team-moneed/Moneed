import axios from 'axios';
import 'server-only';
import { KISTokenService } from '@/6_shared/server/kisToken.service';
import { AxiosError } from 'axios';

const kisTokenService = new KISTokenService();

const getKisInstance = () => {
    const instance = axios.create({
        baseURL: process.env.KIS_BASE_URL,
        headers: {
            'Content-type': 'application/json; charset=utf-8',
            appkey: process.env.KIS_APP_KEY,
            appsecret: process.env.KIS_APP_SECRET,
        },
    });

    instance.interceptors.request.use(async config => {
        try {
            // 토큰 서비스를 통해 유효한 토큰 가져오기
            const kisAccessToken = await kisTokenService.getValidToken();
            const { access_token, token_type } = kisAccessToken;
            config.headers.Authorization = `${token_type} ${access_token}`;
        } catch (error) {
            console.error('Failed to get KIS access token:', error);
            throw error;
        }

        return config;
    });

    instance.interceptors.response.use(
        async response => {
            return response;
        },
        async (error: AxiosError<{ msg_cd: string; rc_cd: string; msg1: string }>) => {
            console.error('KIS API Error:', error.response?.data);

            // msg_cd 가 EGW00201(초당 거래건수 초과) 이라면 1초 후 다시 요청
            if (error.config && error.response && error.response.data.msg_cd === 'EGW00201') {
                const config = error.config; // setTimeout 내부에서도 정상적으로 타입 추론이 되도록 로컬 변수로 추출
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(instance.request(config));
                    }, 1000);
                });
            }

            return Promise.reject(error);
        },
    );
    return instance;
};

const getYoutubeInstance = () => {
    const instance = axios.create({
        baseURL: process.env.YOUTUBE_BASE_URL,
    });

    instance.interceptors.request.use(config => {
        return config;
    });

    instance.interceptors.response.use(
        async response => {
            return response;
        },
        async error => {
            console.error(error.response?.data);
            return Promise.reject(error);
        },
    );

    return instance;
};

export const kis = getKisInstance();
export const youtube = getYoutubeInstance();
