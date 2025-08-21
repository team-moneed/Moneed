import express from 'express';
import axios from 'axios';

const router = express.Router();

// Kakao API Base URL
const KAKAO_API_BASE = 'https://kapi.kakao.com';
const KAKAO_AUTH_BASE = 'https://kauth.kakao.com';

router.get('/login', async (req, res, next) => {
    try {
        const REST_API_KEY = process.env.KAKAO_CLIENT_ID;
        const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
        const state = encodeURIComponent(process.env.KAKAO_STATE_TOKEN!);
        const nonce = encodeURIComponent(process.env.KAKAO_NONCE!);
        const scope = [
            'openid',
            'profile_nickname',
            'profile_image',
            'gender',
            'age_range',
            'account_email',
            'name',
            'birthday',
            'birthyear',
        ];
        const url = `${KAKAO_AUTH_BASE}/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&scope=${scope.join(',')}&state=${state}&nonce=${nonce}`;
        return res.json({ url });
    } catch (error) {
        next(error);
    }
});

/**
 * Kakao OAuth 토큰 발급
 */
router.post('/oauth/token', async (req, res, next) => {
    try {
        const { code, redirect_uri } = req.body;

        if (!code || !redirect_uri) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'code and redirect_uri are required',
            });
        }

        const response = await axios.post(
            `${KAKAO_AUTH_BASE}/oauth/token`,
            {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_CLIENT_ID,
                client_secret: process.env.KAKAO_CLIENT_SECRET,
                redirect_uri,
                code,
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        res.json(response.data);
    } catch (error) {
        next(error);
    }
});

/**
 * Kakao 사용자 정보 조회
 */
router.get('/v2/user/me', async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authorization header is required',
            });
        }

        const response = await axios.get(`${KAKAO_API_BASE}/v2/user/me`, {
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const data = error.response?.data || { error: 'Internal Server Error' };
            return res.status(status).json(data);
        }
        next(error);
    }
});

/**
 * Kakao 로그아웃
 */
router.post('/v1/user/logout', async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authorization header is required',
            });
        }

        const response = await axios.post(
            `${KAKAO_API_BASE}/v1/user/logout`,
            {},
            {
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const data = error.response?.data || { error: 'Internal Server Error' };
            return res.status(status).json(data);
        }
        next(error);
    }
});

/**
 * Kakao 회원탈퇴
 */
router.post('/v1/user/unlink', async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authorization header is required',
            });
        }

        const response = await axios.post(
            `${KAKAO_API_BASE}/v1/user/unlink`,
            {},
            {
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const data = error.response?.data || { error: 'Internal Server Error' };
            return res.status(status).json(data);
        }
        next(error);
    }
});

export { router as kakaoRouter };
