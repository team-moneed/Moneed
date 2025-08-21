import { getSession } from '@/lib/session';
import CommentService from '@/services/comment.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    const { commentId } = await params;
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const commentService = new CommentService();
    await commentService.deleteComment({ commentId: Number(commentId), userId: session.userId });

    return NextResponse.json({ message: '댓글이 삭제되었습니다.' }, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    const { commentId } = await params;
    const { content } = (await req.json()) as { content: string };
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const commentService = new CommentService();
    await commentService.updateComment({ commentId: Number(commentId), content });

    return NextResponse.json({ message: '댓글이 수정되었습니다.' }, { status: 200 });
}
