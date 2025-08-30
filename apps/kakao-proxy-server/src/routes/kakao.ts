import express from 'express';
import { KakaoAuthService } from '@/service/kakaoAuth.service';
import { verifyRequestCookies } from '@/utils/session';
import { createToken, getAccessTokenCookie, getRefreshTokenCookie } from '@moneed/auth';
import { parseDurationToMs, ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/constants/error';

const router = express.Router();

// Kakao API Base URL
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
        return res.redirect(url);
    } catch (error) {
        next(error);
    }
});

router.get('/callback', async (req, res, next) => {
    try {
        const { code, state, error, error_description } = req.query;
        const baseUrl = process.env.MONEED_BASE_URL || '';

        if (error || error_description) {
            return res.redirect(`${baseUrl}/auth/error?error=${error}&description=${error_description}`);
        }

        if (!code) {
            return res.redirect(`${baseUrl}/auth/error?error=missing_code`);
        }

        if (!state || state !== process.env.KAKAO_STATE_TOKEN) {
            return res.redirect(`${baseUrl}/auth/error?error=invalid_state`);
        }

        const kakaoAuthService = new KakaoAuthService();
        const result = await kakaoAuthService.login({ code: code as string });

        if (result.success) {
            const key = process.env.SESSION_SECRET;
            if (!key) {
                console.error(ERROR_MSG.SESSION_SECRET_NOT_SET);
                throw new ResponseError(500, ERROR_MSG.INTERNAL_SERVER_ERROR);
            }
            const accessToken = await createToken({
                payload: result.data.payload,
                duration: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
                key,
            });
            const refreshToken = await createToken({
                payload: result.data.payload,
                duration: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
                key,
            });

            const accessTokenCookie = getAccessTokenCookie(
                process.env.JWT_ACCESS_EXPIRES_IN || '24h',
                process.env.JWT_ACCESS_NAME || 'access_token',
            );
            const refreshTokenCookie = getRefreshTokenCookie(
                process.env.JWT_REFRESH_EXPIRES_IN || '30d',
                process.env.JWT_REFRESH_NAME || 'refresh_token',
            );
            res.cookie(accessTokenCookie.name, accessToken, {
                ...accessTokenCookie.options,
                expires: new Date(Date.now() + parseDurationToMs(process.env.JWT_ACCESS_EXPIRES_IN || '24h')),
            });
            res.cookie(refreshTokenCookie.name, refreshToken, {
                ...refreshTokenCookie.options,
                expires: new Date(Date.now() + parseDurationToMs(process.env.JWT_REFRESH_EXPIRES_IN || '30d')),
            });

            const redirectPath = result.data.isNewUser ? `/selectstocktype?url=${encodeURIComponent('/welcome')}` : `/`;
            return res.redirect(`${baseUrl}${redirectPath}`);
        } else {
            return res.redirect(`${baseUrl}/auth/error?error=${result.error}`);
        }
    } catch (error) {
        if (error instanceof ResponseError) {
            return res.status(error.code).json({ message: error.message });
        }
        next(error);
    }
});

router.post('/logout', async (req, res, next) => {
    try {
        const { accessTokenPayload } = await verifyRequestCookies(req);
        const { userId } = accessTokenPayload;

        if (!userId) {
            return res.status(200).json({
                message: '로그아웃 성공',
            });
        }

        const kakaoAuthService = new KakaoAuthService();
        const result = await kakaoAuthService.logout({ userId, response: res });

        if (result.success) {
            return res.status(result.status).json({
                message: result.message,
            });
        } else {
            return res.status(result.status).json({
                message: result.error,
            });
        }
    } catch (error) {
        console.error('로그아웃 오류:', error);
        if (error instanceof ResponseError) {
            return res.status(error.code).json({ message: error.message });
        }
        next(error);
    }
});

/**
 * 회원탈퇴 (내부 로직)
 */
router.post('/leave', async (req, res, next) => {
    try {
        const { accessTokenPayload } = await verifyRequestCookies(req);
        const { reason } = req.body;

        const kakaoAuthService = new KakaoAuthService();
        const result = await kakaoAuthService.leave({ userId: accessTokenPayload.userId, reason, response: res });

        if (result.success) {
            return res.status(result.status).json({
                message: result.message,
            });
        } else {
            return res.status(result.status).json({
                error: result.error,
            });
        }
    } catch (error) {
        console.error('회원탈퇴 오류:', error);
        if (error instanceof ResponseError) {
            return res.status(error.code).json({ message: error.message });
        }
        next(error);
    }
});

router.post('/refresh', async (req, res, next) => {
    try {
        const { accessTokenPayload } = await verifyRequestCookies(req);

        const kakaoAuthService = new KakaoAuthService();
        const result = await kakaoAuthService.refresh({ userId: accessTokenPayload.userId });

        if (result.success) {
            return res.status(result.status).json(result.data);
        } else {
            return res.status(result.status).json({
                error: result.error,
            });
        }
    } catch (error) {
        if (error instanceof ResponseError) {
            return res.status(error.code).json({ message: error.message });
        }
        next(error);
    }
});

export { router as kakaoRouter };
