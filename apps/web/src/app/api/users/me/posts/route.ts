import { getSession } from '@/lib/session';
import PostService from '@/services/post.service';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: '유저 정보를 조회할 수 없습니다. 로그인을 해주세요.' }, { status: 401 });
    }

    const { userId } = session;
    const postService = new PostService();

    const posts = await postService.getPostsWithUserExtended({ userId });

    return NextResponse.json(posts);
}
