import { verifyRequestCookies, assertAccessTokenPayload } from '@/shared/utils/cookie.server';
import { CommentService } from '@/features/comment/server';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/shared/config/message';

export async function deleteComment(_: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const { commentId } = await params;
        const { accessTokenPayload } = await verifyRequestCookies();
        assertAccessTokenPayload(accessTokenPayload);

        const commentService = new CommentService();
        await commentService.deleteComment({ commentId: Number(commentId), userId: accessTokenPayload.userId });

        return NextResponse.json({ message: SUCCESS_MSG.COMMENT_DELETED }, { status: 200 });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

export async function updateComment(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const { commentId } = await params;
        const { content } = (await req.json()) as { content: string };
        await verifyRequestCookies();

        const commentService = new CommentService();
        await commentService.updateComment({ commentId: Number(commentId), content });

        return NextResponse.json({ message: SUCCESS_MSG.COMMENT_UPDATED }, { status: 200 });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

// TODO: POST 도메인으로 이동
export async function getPostComments(req: NextRequest) {
    try {
        const postId = req.nextUrl.searchParams.get('postId');
        if (!postId) {
            throw new ResponseError(400, ERROR_MSG.POST_ID_REQUIRED);
        }

        const commentService = new CommentService();
        const comments = await commentService.getPostComments({ postId: Number(postId) });
        return NextResponse.json(comments);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

export async function createComment(req: NextRequest) {
    try {
        const { postId, content } = await req.json();
        const { accessTokenPayload } = await verifyRequestCookies();

        if (!accessTokenPayload) {
            return NextResponse.json({ error: ERROR_MSG.UNAUTHORIZED }, { status: 401 });
        }

        const commentService = new CommentService();
        await commentService.createComment({ postId, content, userId: accessTokenPayload.userId });

        return NextResponse.json({ message: SUCCESS_MSG.COMMENT_CREATED }, { status: 201 });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
