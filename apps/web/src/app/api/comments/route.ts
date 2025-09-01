import CommentService from '@/services/comment.service';
import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestCookies } from '@/utils/cookie.server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/message';

export async function POST(req: NextRequest) {
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
