import PostService from '@/services/post.service';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { UpdatePostRequest } from '@/types/post';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const payload = await getSession();
    const postService = new PostService();
    const post = await postService.getPost({ userId: payload?.userId, postId: Number(postId) });
    return NextResponse.json(post);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const payload = await getSession();
    if (!payload) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const postService = new PostService();
    const post = await postService.deletePost({ postId: Number(postId), userId: payload.userId });
    return NextResponse.json(
        { message: '게시글이 삭제되었습니다.', stockSymbol: post.stockSymbol, postId: post.id },
        { status: 200 },
    );
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const thumbnailImage = formData.get('thumbnailImage') as UpdatePostRequest['thumbnailImage'];
    const prevThumbnailImageUrl = formData.get('prevThumbnailImageUrl') as UpdatePostRequest['prevThumbnailImageUrl'];

    const payload = await getSession();
    if (!payload) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const postService = new PostService();
    const post = await postService.updatePost({
        postId: Number(postId),
        userId: payload.userId,
        title,
        content,
        thumbnailImage: thumbnailImage,
        prevThumbnailImageUrl: prevThumbnailImageUrl,
    });
    return NextResponse.json(
        { message: '게시글이 수정되었습니다.', stockSymbol: post.stockSymbol, postId: post.id },
        { status: 200 },
    );
}
