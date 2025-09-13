import { NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/shared/config';
import UserService from './user.service';
import { UpdateUserProfileRequest } from '@/features/user';
import { getCookie } from '@/shared/utils/cookie.server';
import { verifyToken } from '@moneed/auth';
import { ERROR_MSG as AUTH_ERROR_MSG } from '@moneed/auth';

export async function getUserPosts() {
    try {
        const accessToken = await getCookie(process.env.JWT_ACCESS_NAME || 'access_token');
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const userService = new UserService();
        const posts = await userService.getUserPosts({ userId });

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
        const accessToken = await getCookie(process.env.JWT_ACCESS_NAME || 'access_token');
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const userService = new UserService();
        const comments = await userService.getUserComments({ userId });

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
        const accessToken = await getCookie(process.env.JWT_ACCESS_NAME || 'access_token');
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        if (!userId) {
            return NextResponse.json({ error: ERROR_MSG.UNAUTHORIZED }, { status: 401 });
        }

        const userService = new UserService();
        const user = await userService.getUserInfo({ userId });

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
        const accessToken = await getCookie(process.env.JWT_ACCESS_NAME || 'access_token');
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        if (!userId) {
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
            userId,
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
