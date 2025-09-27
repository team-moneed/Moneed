import TokenCookie from '@/6_shared/utils/token.cookie';
import { CommentService } from '@/4_features/comment/server';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/6_shared/config/message';
import { verifyToken } from '@moneed/auth';
import { ERROR_MSG as AUTH_ERROR_MSG } from '@moneed/auth';
import { TOKEN_KEY } from '@/6_shared/config';

export async function deleteComment(_: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const { commentId } = await params;
        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const commentService = new CommentService();
        await commentService.deleteComment({ commentId: Number(commentId), userId });

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
        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }

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
        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const commentService = new CommentService();
        await commentService.createComment({ postId, content, userId });

        return NextResponse.json({ message: SUCCESS_MSG.COMMENT_CREATED }, { status: 201 });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
