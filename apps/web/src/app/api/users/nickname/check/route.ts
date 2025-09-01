import { NextResponse } from 'next/server';
import UserService from '@/services/user.service';
import { verifyRequestCookies, assertAccessTokenPayload } from '@/utils/cookie.server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/message';

export async function POST(request: Request) {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();
        assertAccessTokenPayload(accessTokenPayload);

        const { nickname } = await request.json();
        const userService = new UserService();

        const isDuplicate = await userService.isDuplicateNickname({ userId: accessTokenPayload.userId, nickname });
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
