import { verifyRequestCookies, assertAccessTokenPayload } from '@/shared/utils/cookie.server';
import PostService from '@/services/post.service';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/shared/config/message';

export const dynamic = 'force-dynamic';

export async function POST(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;
        const { accessTokenPayload } = await verifyRequestCookies();
        assertAccessTokenPayload(accessTokenPayload);

        const postService = new PostService();
        await postService.likePost({ postId: Number(postId), userId: accessTokenPayload.userId });

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
        const { accessTokenPayload } = await verifyRequestCookies();
        assertAccessTokenPayload(accessTokenPayload);

        const postService = new PostService();
        await postService.unlikePost({ postId: Number(postId), userId: accessTokenPayload.userId });

        return NextResponse.json({ message: SUCCESS_MSG.POST_UNLIKED });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
