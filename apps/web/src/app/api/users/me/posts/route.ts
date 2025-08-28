import PostService from '@/services/post.service';
import { NextResponse } from 'next/server';
import { verifyRequestCookies } from '@/utils/cookie';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/constants/message';

export async function GET() {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        const postService = new PostService();
        const posts = await postService.getPostsWithUserExtended({ userId: accessTokenPayload.userId });

        return NextResponse.json(posts);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
