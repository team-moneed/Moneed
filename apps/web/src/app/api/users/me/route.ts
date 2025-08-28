import { verifyRequestCookies } from '@/utils/cookie';
import type { UpdateUserProfileRequest } from '@/types/user';
import UserService from '@/services/user.service';
import { NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/constants/message';

export async function GET() {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        const userService = new UserService();
        const user = await userService.getUserInfo({ userId: accessTokenPayload.userId });

        if (!user) {
            return NextResponse.json({ error: ERROR_MSG.USER_NOT_FOUND }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        const formData = await request.formData();
        const nickname = formData.get('nickname') as UpdateUserProfileRequest['nickname'];
        const profileImage = formData.get('profileImage') as UpdateUserProfileRequest['profileImage'];
        const prevProfileImageUrl = formData.get(
            'prevProfileImageUrl',
        ) as UpdateUserProfileRequest['prevProfileImageUrl'];
        const userService = new UserService();

        const user = await userService.updateUserProfile({
            userId: accessTokenPayload.userId,
            nickname,
            profileImage,
            prevProfileImageUrl,
        });
        return NextResponse.json(user);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
