import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

// 메모리 기반 rate limit 저장소 (실제 운영에서는 Redis 사용 권장)
const store: RateLimitStore = {};

/**
 * Rate Limiter 미들웨어
 * 기본: 1분당 100회 요청 제한
 */
export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'); // 1분
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'); // 100회

    // 클라이언트 식별 (IP 주소 기반)
    const clientId = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // 저장소에서 클라이언트 정보 조회
    const clientData = store[clientId];

    // 첫 요청이거나 윈도우가 리셋된 경우
    if (!clientData || now > clientData.resetTime) {
        store[clientId] = {
            count: 1,
            resetTime: now + windowMs,
        };

        // 응답 헤더 설정
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
        res.setHeader('X-RateLimit-Reset', new Date(store[clientId].resetTime).toISOString());

        return next();
    }

    // 요청 횟수 증가
    clientData.count++;

    // 제한 초과 확인
    if (clientData.count > maxRequests) {
        const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);

        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
        res.setHeader('Retry-After', retryAfter);

        return res.status(429).json({
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
            retryAfter,
        });
    }

    // 응답 헤더 설정
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - clientData.count);
    res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());

    next();
};

/**
 * 만료된 rate limit 데이터 정리 (메모리 누수 방지)
 */
export const cleanupRateLimitStore = () => {
    const now = Date.now();

    for (const clientId in store) {
        if (store[clientId].resetTime < now) {
            delete store[clientId];
        }
    }
};

// 5분마다 정리 작업 실행
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);


