import { getSession } from '@/lib/session';
import CommentService from '@/services/comment.service';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: '유저 정보를 조회할 수 없습니다. 로그인을 해주세요.' }, { status: 401 });
    }

    const { userId } = session;
    const commentService = new CommentService();

    const comments = await commentService.getUserComments({ userId });

    return NextResponse.json(comments);
}
