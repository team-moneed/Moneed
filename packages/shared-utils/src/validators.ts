/**
 * 공통 검증 유틸리티 함수들
 */

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isValidKakaoToken = (token: string): boolean => {
    return typeof token === 'string' && token.length > 0;
};

export const sanitizeString = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
};

export const validateKakaoAuthCode = (code: string): boolean => {
    return typeof code === 'string' && code.length > 0;
};

export const validateRedirectUri = (uri: string): boolean => {
    return isValidUrl(uri) && (uri.startsWith('http://') || uri.startsWith('https://'));
};

/**
 * Rate limit 헤더 검증
 */
export const parseRateLimitHeaders = (headers: Record<string, string>) => {
    return {
        limit: parseInt(headers['x-ratelimit-limit'] || '0'),
        remaining: parseInt(headers['x-ratelimit-remaining'] || '0'),
        reset: headers['x-ratelimit-reset'] || '',
        retryAfter: parseInt(headers['retry-after'] || '0'),
    };
};

/**
 * 환경변수 검증
 */
export const validateEnvVars = (requiredVars: string[]): void => {
    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};
