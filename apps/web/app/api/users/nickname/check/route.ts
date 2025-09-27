import { NextResponse } from 'next/server';
import UserService from '@/features/user/server/user.service';
import TokenCookie from '@/shared/utils/token.cookie';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/shared/config/message';
import { verifyToken } from '@moneed/auth';
import { ERROR_MSG as AUTH_ERROR_MSG } from '@moneed/auth';
import { TOKEN_KEY } from '@/shared/config';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const { nickname } = await request.json();
        const userService = new UserService();

        const isDuplicate = await userService.isDuplicateNickname({ userId, nickname });
        if (isDuplicate) {
            return NextResponse.json({ error: ERROR_MSG.DUPLICATE_NICKNAME, nickname }, { status: 409 });
        } else {
            return NextResponse.json({ message: SUCCESS_MSG.NICKNAME_CHECK_SUCCESS, nickname }, { status: 200 });
        }
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
