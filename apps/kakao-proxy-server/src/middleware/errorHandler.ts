import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export interface CustomError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

/**
 * 글로벌 에러 핸들러
 */
export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    // 이미 응답이 전송된 경우 기본 에러 핸들러로 위임
    if (res.headersSent) {
        return next(error);
    }

    // CORS 에러 처리
    if (error.message === 'Not allowed by CORS') {
        console.error('CORS Error:', {
            origin: req.headers.origin,
            url: req.originalUrl,
            method: req.method,
        });

        return res.status(403).json({
            error: 'CORS Error',
            message: 'Origin not allowed',
        });
    }

    // Axios 에러 처리
    if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.error_description || error.response?.data?.message || error.message;

        console.error(`Axios Error [${status}]:`, {
            url: error.config?.url,
            method: error.config?.method,
            data: error.response?.data,
            message: error.message,
        });

        return res.status(status).json({
            error: 'External API Error',
            message,
            ...(process.env.NODE_ENV === 'development' && {
                details: error.response?.data,
            }),
        });
    }

    // 커스텀 에러 처리
    if (error.isOperational && error.statusCode) {
        console.error(`Operational Error [${error.statusCode}]:`, error.message);

        return res.status(error.statusCode).json({
            error: 'Operational Error',
            message: error.message,
        });
    }

    // 예상치 못한 에러 처리
    console.error('Unexpected Error:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
};
