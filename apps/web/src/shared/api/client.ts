// import { REASON_CODES } from '@/constants/snackbar';
import { ERROR_MSG } from '@/shared/config/message';
import axios, { AxiosRequestConfig } from 'axios';
import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { refresh } from '@/features/auth/api';
import { getAccessToken, getRefreshToken, clearTokens, setTokens } from '@/shared/utils/token';
import { REASON_CODES } from '@/shared/config/snackbar';
import { PATH } from '../config';

interface QueuedRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

/**
 * 토큰 관리 및 갱신을 담당하는 클래스
 */
class TokenManager {
    private isRefreshing = false;
    private refreshPromise: Promise<string> | null = null;
    private requestQueue: QueuedRequest[] = [];
    private retryCount = 0;
    private maxRetryCount = 1;

    /**
     * 토큰 갱신 요청을 큐에 추가
     */
    private enqueueRequest(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.requestQueue.push({ resolve, reject });
        });
    }

    /**
     * 큐에 있는 모든 요청에게 결과 전파
     */
    private processQueue(error: any = null, token: string | null = null): void {
        this.requestQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else if (token) {
                resolve(token);
            }
        });

        this.requestQueue = [];
    }

    /**
     * 실제 토큰 갱신 로직
     */
    private async performTokenRefresh(): Promise<string> {
        try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                throw new Error(ERROR_MSG.NO_REFRESH_TOKEN);
            }

            const refreshResponse = await refresh({
                provider: 'kakao',
                refreshToken,
            });

            const { access_token, refresh_token } = refreshResponse.data;

            // 새 토큰들을 로컬스토리지와 쿠키에 저장
            await setTokens(access_token, refresh_token);

            return access_token;
        } catch (error) {
            // 토큰 갱신 실패 시 로그아웃 처리
            await clearTokens();

            if (typeof window !== 'undefined') {
                window.location.href = `${PATH.ONBOARDING}?reason=${REASON_CODES.EXPIRED_SESSION}`;
            }

            throw error;
        }
    }

    /**
     * 토큰 갱신 처리 (중복 요청 방지)
     */
    async refreshToken(): Promise<string> {
        // 이미 갱신 중이면 기존 Promise를 반환하거나 큐에 추가
        if (this.isRefreshing) {
            if (this.refreshPromise) {
                return this.refreshPromise;
            }
            return this.enqueueRequest();
        }

        // 토큰 갱신 시작
        this.isRefreshing = true;

        this.refreshPromise = this.performTokenRefresh()
            .then(newToken => {
                // 성공 시 큐의 모든 요청에게 새 토큰 전달
                this.processQueue(null, newToken);
                return newToken;
            })
            .catch(error => {
                // 실패 시 큐의 모든 요청에게 에러 전달
                this.processQueue(error, null);
                throw error;
            })
            .finally(() => {
                // 갱신 완료 후 상태 초기화
                this.isRefreshing = false;
                this.refreshPromise = null;
            });

        return this.refreshPromise;
    }

    /**
     * 원본 요청 재시도
     */
    async retryOriginalRequest(instance: AxiosInstance, error: AxiosError): Promise<AxiosResponse> {
        if (this.retryCount >= this.maxRetryCount) {
            throw new Error(ERROR_MSG.TOKEN_REFRESH_FAILED);
        }

        try {
            // 토큰 갱신
            const newToken = await this.refreshToken();
            // 원본 요청에 새 토큰 설정
            const originalRequest = error.config!;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            this.retryCount++;

            // 원본 요청 재시도
            return instance.request(originalRequest);
        } catch (refreshError) {
            // 토큰 갱신 실패 시 원본 에러와 함께 reject
            const errorMessage = refreshError instanceof Error ? refreshError.message : ERROR_MSG.TOKEN_REFRESH_FAILED;

            throw new Error(errorMessage);
        }
    }
}

// TokenManager 인스턴스 생성
const tokenManager = new TokenManager();

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
            const accessToken = getAccessToken();
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
                    return await tokenManager.retryOriginalRequest(instance, error);
                } catch (retryError) {
                    console.error(ERROR_MSG.TOKEN_REFRESH_FAILED, retryError);
                    return Promise.reject(retryError);
                }
            }

            return Promise.reject(error);
        },
    );

    return instance;
};

export const proxy = getAxiosInstance(proxyBaseConfig);
export const http = getAxiosInstance(moneedBaseConfig);
