import { ERROR_MSG } from '@/constants/error';
import type { TokenPayload } from '@moneed/auth';
import { verifyToken } from '@moneed/auth';
import { Request } from 'express';
import { ResponseError } from '@moneed/utils';
// 쿠키 관련 코드는 더 이상 사용하지 않음

export async function verifyRequestTokens(req: Request) {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.replace('Bearer ', '');

    // 리프레쉬 토큰은 별도 헤더나 바디에서 가져올 수 있지만,
    // 현재는 액세스 토큰만 검증하도록 단순화
    if (!accessToken) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_INVALID);
    }

    const key = process.env.SESSION_SECRET;
    if (!key) {
        console.error(ERROR_MSG.SESSION_SECRET_NOT_SET);
        throw new ResponseError(500, ERROR_MSG.SESSION_SECRET_NOT_SET);
    }

    const accessTokenResult = await verifyToken({ jwt: accessToken, key });
    if (accessTokenResult.isExpired) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_EXPIRED);
    }

    if (accessTokenResult.isInvalid) {
        throw new ResponseError(401, ERROR_MSG.ACCESS_TOKEN_INVALID);
    }

    return {
        accessToken: accessToken as string,
        accessTokenPayload: accessTokenResult.payload as TokenPayload,
    };
}
