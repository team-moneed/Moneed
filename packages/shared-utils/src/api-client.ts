import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@moneed/shared-types';

export class ProxyApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string = 'http://localhost:8000') {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            config => {
                console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            error => {
                console.error('❌ API Request Error:', error);
                return Promise.reject(error);
            },
        );

        // Response interceptor
        this.client.interceptors.response.use(
            response => {
                console.log(`✅ API Response: ${response.status} ${response.config.url}`);
                return response;
            },
            error => {
                console.error(
                    `❌ API Response Error: ${error.response?.status} ${error.config?.url}`,
                    error.response?.data,
                );
                return Promise.reject(error);
            },
        );
    }

    // Kakao API 프록시 메서드들
    async kakaoOAuthToken(code: string, redirectUri: string): Promise<ApiResponse> {
        const response = await this.client.post('/api/kakao/oauth/token', {
            code,
            redirect_uri: redirectUri,
        });
        return response.data;
    }

    async kakaoUserInfo(accessToken: string): Promise<ApiResponse> {
        const response = await this.client.get('/api/kakao/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }

    async kakaoLogout(accessToken: string): Promise<ApiResponse> {
        const response = await this.client.post(
            '/api/kakao/v1/user/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return response.data;
    }

    async kakaoUnlink(accessToken: string): Promise<ApiResponse> {
        const response = await this.client.post(
            '/api/kakao/v1/user/unlink',
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return response.data;
    }

    // Health check
    async healthCheck(): Promise<ApiResponse> {
        const response = await this.client.get('/health');
        return response.data;
    }

    // Generic request method
    async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.request<T>(config);
    }
}

// 싱글톤 인스턴스
export const proxyApiClient = new ProxyApiClient();


