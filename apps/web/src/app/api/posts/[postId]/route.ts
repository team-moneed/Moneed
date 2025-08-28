import PostService from '@/services/post.service';
import { verifyRequestCookies } from '@/utils/cookie';
import { NextRequest, NextResponse } from 'next/server';
import { UpdatePostRequest } from '@/types/post';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/message';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;

        const { accessTokenPayload } = await verifyRequestCookies();
        const userId = accessTokenPayload.userId;

        const postService = new PostService();
        const post = await postService.getPost({ userId, postId: Number(postId) });
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
        const { accessTokenPayload } = await verifyRequestCookies();

        const postService = new PostService();
        const post = await postService.deletePost({ postId: Number(postId), userId: accessTokenPayload.userId });
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

        const { accessTokenPayload } = await verifyRequestCookies();

        const postService = new PostService();
        const post = await postService.updatePost({
            postId: Number(postId),
            userId: accessTokenPayload.userId,
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
