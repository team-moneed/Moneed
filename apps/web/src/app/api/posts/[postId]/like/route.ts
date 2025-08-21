import { getSession } from '@/lib/session';
import PostService from '@/services/post.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;
    const postService = new PostService();
    await postService.likePost({ postId: Number(postId), userId });

    return NextResponse.json({ message: '좋아요' });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;
    const postService = new PostService();
    await postService.unlikePost({ postId: Number(postId), userId });

    return NextResponse.json({ message: '좋아요 취소' });
}
