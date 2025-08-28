import { verifyRequestCookies } from '@/utils/cookie';
import CommentService from '@/services/comment.service';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/message';

export const dynamic = 'force-dynamic';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const { commentId } = await params;
        const { accessTokenPayload } = await verifyRequestCookies();

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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
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
