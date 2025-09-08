import { NextResponse } from 'next/server';
import { verifyRequestCookies, assertAccessTokenPayload } from '@/shared/utils/index.server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/shared/config';
import UserService from './user.service';
import { UpdateUserProfileRequest } from '@/types/user';

export async function getUserPosts() {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();
        assertAccessTokenPayload(accessTokenPayload);

        const userService = new UserService();
        const posts = await userService.getUserPosts({ userId: accessTokenPayload.userId });

        return NextResponse.json(posts);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

export async function getUserComments() {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();
        assertAccessTokenPayload(accessTokenPayload);

        const userService = new UserService();
        const comments = await userService.getUserComments({ userId: accessTokenPayload.userId });

        return NextResponse.json(comments);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

export async function getUserInfo() {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        if (!accessTokenPayload) {
            return NextResponse.json({ error: ERROR_MSG.UNAUTHORIZED }, { status: 401 });
        }

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

export async function updateUserProfile(request: Request) {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        if (!accessTokenPayload) {
            return NextResponse.json({ error: ERROR_MSG.UNAUTHORIZED }, { status: 401 });
        }

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
