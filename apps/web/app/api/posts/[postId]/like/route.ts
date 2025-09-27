import TokenCookie from '@/shared/utils/token.cookie';
import { PostService } from '@/features/post/server';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/shared/config/message';
import { ERROR_MSG as AUTH_ERROR_MSG } from '@moneed/auth';
import { verifyToken } from '@moneed/auth';
import { TOKEN_KEY } from '@/shared/config';

export const dynamic = 'force-dynamic';

export async function POST(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;
        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;
        const postService = new PostService();
        await postService.likePost({ postId: Number(postId), userId });

        return NextResponse.json({ message: SUCCESS_MSG.POST_LIKED });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;
        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const postService = new PostService();
        await postService.unlikePost({ postId: Number(postId), userId });

        return NextResponse.json({ message: SUCCESS_MSG.POST_UNLIKED });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
