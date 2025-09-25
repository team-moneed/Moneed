import express from 'express';
import { KakaoAuthService } from '@/service/kakaoAuth.service';
import { verifyRequestTokens } from '@/utils/session';
import { createToken } from '@moneed/auth';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/constants/error';
import { generateTempCode, consumeTempCode } from '@/utils/tempCode';
import { fetchKakaoToken, fetchKakaoUserInfo } from '@/api/kakao.api';
import { AuthService } from '@/service/auth.service';
import { User } from '@prisma/client';

const router = express.Router();

// Kakao API Base URL
const KAKAO_AUTH_BASE = 'https://kauth.kakao.com';

router.get('/login', async (req, res, next) => {
    try {
        const REST_API_KEY = process.env.KAKAO_CLIENT_ID;
        const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

        const state = encodeURIComponent(process.env.KAKAO_STATE_TOKEN!);
        const nonce = encodeURIComponent(process.env.KAKAO_NONCE!);
        // const scope = [
        //     'openid',
        //     'profile_nickname',
        //     'profile_image',
        //     'gender',
        //     'age_range',
        //     'account_email',
        //     'name',
        //     'birthday',
        //     'birthyear',
        // ];
        /**
         * 동의항목 추가 신청 통과 시 위 주석 해제 후 사용 (현재는 기본 동의항목만 사용)
         * @docs https://developers.kakao.com/docs/latest/ko/app-setting/app#app-permission
         */
        // const scope = ['openid', 'profile_nickname', 'profile_image'];
        const url = `${KAKAO_AUTH_BASE}/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&state=${state}&nonce=${nonce}`;
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

        // const kakaoAuthService = new KakaoAuthService();
        const authService = new AuthService();
        // const result = await kakaoAuthService.login({ code: code as string });

        // 1. 카카오 액세스 토큰 요청
        const kakaoToken = await fetchKakaoToken(code as string);
        // 2. 카카오 유저 정보 조회
        const kakaoUserInfo = await fetchKakaoUserInfo(kakaoToken.access_token);
        // 3. 기존 유저인지 확인
        const existingUser = await authService.checkExistingUser({
            provider: 'kakao',
            providerUserId: kakaoUserInfo.id.toString(),
        });

        let user: User | undefined;
        // 3-1. 기존 유저일 경우 로그인
        if (existingUser.isExisting) {
            user = await authService.signIn({
                userId: existingUser.user.id,
                kakaoToken,
            });
        } else {
            // 3-2. 기존 유저가 아닐 경우 회원가입
            user = await authService.signUp({
                provider: 'kakao',
                providerUserId: kakaoUserInfo.id.toString(),
                accessToken: kakaoToken.access_token,
                refreshToken: kakaoToken.refresh_token,
                accessTokenExpiresIn: new Date(Date.now() + kakaoToken.expires_in * 1000),
                refreshTokenExpiresIn: new Date(Date.now() + kakaoToken.refresh_token_expires_in * 1000),
            });
        }

        // 4. 토큰 생성
        const key = process.env.SESSION_SECRET;
        const payload = {
            id: user.id,
            nickname: user.nickname,
            profileImage: user.profileImage,
        };
        if (!key) {
            console.error(ERROR_MSG.SESSION_SECRET_NOT_SET);
            throw new ResponseError(500, ERROR_MSG.INTERNAL_SERVER_ERROR);
        }
        const accessToken = await createToken({
            payload,
            duration: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
            key,
        });
        const refreshToken = await createToken({
            payload,
            duration: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
            key,
        });

        // 5. 임시 코드 생성
        const tempCode = generateTempCode({
            accessToken,
            refreshToken,
            payload: payload,
            isNewUser: !existingUser.isExisting,
        });

        // 6. 리다이렉트
        return res.redirect(`${baseUrl}/auth/callback?tempCode=${tempCode}`);
    } catch (error) {
        if (error instanceof ResponseError) {
            return res.status(error.code).json({ message: error.message });
        }
        console.error('카카오 로그인 오류:', error);
        return res.status(500).json({ message: ERROR_MSG.INTERNAL_SERVER_ERROR });
    }
});

router.post('/logout', async (req, res, next) => {
    try {
        const sessionResult = await verifyRequestTokens(req);

        if (sessionResult.error) {
            throw sessionResult.error;
        }

        const userId = sessionResult.data.id;

        const kakaoAuthService = new KakaoAuthService();
        const result = await kakaoAuthService.logout({ userId });

        if (result.success) {
            return res.status(result.status).json({
                message: result.message,
            });
        } else {
            throw new ResponseError(result.status, result.error);
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
        const sessionResult = await verifyRequestTokens(req);
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;
        const { reason } = req.body;

        const kakaoAuthService = new KakaoAuthService();
        const result = await kakaoAuthService.leave({ userId, reason });

        if (result.success) {
            return res.status(result.status).json({
                message: result.message,
            });
        } else {
            throw new ResponseError(result.status, result.error);
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
        const sessionResult = await verifyRequestTokens(req);
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        console.log('sessionResult', sessionResult);
        const userId = sessionResult.data.id;

        const kakaoAuthService = new KakaoAuthService();
        const result = await kakaoAuthService.refresh({ userId });

        if (result.success) {
            const key = process.env.SESSION_SECRET;
            if (!key) {
                console.error(ERROR_MSG.SESSION_SECRET_NOT_SET);
                throw new ResponseError(500, ERROR_MSG.INTERNAL_SERVER_ERROR);
            }
            const accessToken = await createToken({
                payload: sessionResult.data,
                duration: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
                key,
            });
            const refreshToken = await createToken({
                payload: sessionResult.data,
                duration: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
                key,
            });

            return res.status(result.status).json({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        } else {
            throw new ResponseError(result.status, result.error);
        }
    } catch (error) {
        if (error instanceof ResponseError) {
            return res.status(error.code).json({ message: error.message });
        }
        next(error);
    }
});

/**
 * 임시 코드로 실제 토큰들 교환
 */
router.post('/exchange', async (req, res, next) => {
    try {
        const { tempCode } = req.body;

        if (!tempCode) {
            return res.status(400).json({
                error: '임시 코드가 필요합니다.',
            });
        }

        const data = consumeTempCode(tempCode);

        if (!data) {
            return res.status(400).json({
                error: '유효하지 않거나 만료된 임시 코드입니다.',
            });
        }

        return res.status(200).json({
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
            payload: data.payload,
            isNewUser: data.isNewUser,
        });
    } catch (error) {
        console.error('토큰 교환 오류:', error);
        if (error instanceof ResponseError) {
            return res.status(error.code).json({ message: error.message });
        }
        next(error);
    }
});

export { router as kakaoRouter };
