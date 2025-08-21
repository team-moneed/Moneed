export * from './auth';

// API Response Types
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    success: boolean;
}

// Kakao API Types
export interface KakaoTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
}

export interface KakaoUserInfo {
    id: number;
    connected_at: string;
    properties: {
        nickname: string;
        profile_image?: string;
        thumbnail_image?: string;
    };
    kakao_account: {
        profile_nickname_needs_agreement: boolean;
        profile_image_needs_agreement: boolean;
        profile: {
            nickname: string;
            thumbnail_image_url?: string;
            profile_image_url?: string;
            is_default_image: boolean;
        };
        has_email: boolean;
        email_needs_agreement: boolean;
        is_email_valid: boolean;
        is_email_verified: boolean;
        email?: string;
    };
}

export interface KakaoErrorResponse {
    error: string;
    error_description: string;
    error_code: number;
}

// Proxy Server Types
export interface ProxyServerConfig {
    port: number;
    allowedOrigins: string[];
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
}

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: string;
    retryAfter?: number;
}

// Common Error Types
export interface ErrorResponse {
    error: string;
    message: string;
    statusCode?: number;
    details?: any;
}

// Health Check Types
export interface HealthCheckResponse {
    status: 'OK' | 'ERROR';
    timestamp: string;
    service: string;
    version?: string;
}
