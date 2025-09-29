import { PostService } from '@/4_features/post/server';
import TokenCookie from '@/6_shared/utils/token.cookie';
import { NextRequest, NextResponse } from 'next/server';
import { UpdatePostRequest } from '@/4_features/post/model/post.type';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/6_shared/config/message';
import { ERROR_MSG as AUTH_ERROR_MSG } from '@moneed/auth';
import { verifyToken } from '@moneed/auth';
import { TOKEN_KEY } from '@/6_shared/config';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;

        const postService = new PostService();
        const post = await postService.getPost({ postId: Number(postId) });
        return NextResponse.json(post);
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
        const post = await postService.deletePost({ postId: Number(postId), userId });
        return NextResponse.json(
            { message: SUCCESS_MSG.POST_DELETED, stockSymbol: post.stockSymbol, postId: post.id },
            { status: 200 },
        );
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const thumbnailImage = formData.get('thumbnailImage') as UpdatePostRequest['thumbnailImage'];
        const prevThumbnailImageUrl = formData.get(
            'prevThumbnailImageUrl',
        ) as UpdatePostRequest['prevThumbnailImageUrl'];

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
        const post = await postService.updatePost({
            postId: Number(postId),
            userId,
            title,
            content,
            thumbnailImage: thumbnailImage,
            prevThumbnailImageUrl: prevThumbnailImageUrl,
        });
        return NextResponse.json(
            { message: SUCCESS_MSG.POST_UPDATED, stockSymbol: post.stockSymbol, postId: post.id },
            { status: 200 },
        );
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
