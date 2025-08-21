import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { kakaoRouter } from './routes/kakao.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// 환경변수 로드
dotenv.config({ path: '.env' });
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 8000;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
    }),
);
app.use(morgan('combined')); // 로깅
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting 적용
app.use(rateLimiter);

// 라우터 설정
app.use('/api/auth/kakao', kakaoRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Moneed Proxy Server',
    });
});

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 404 핸들러
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

export default app;
