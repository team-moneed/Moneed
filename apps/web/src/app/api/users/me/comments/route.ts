import { verifyRequestCookies, assertAccessTokenPayload } from '@/utils/cookie.server';
import CommentService from '@/services/comment.service';
import { NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/constants/message';

export async function GET() {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();
        assertAccessTokenPayload(accessTokenPayload);

        const commentService = new CommentService();
        const comments = await commentService.getUserComments({ userId: accessTokenPayload.userId });

        return NextResponse.json(comments);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
