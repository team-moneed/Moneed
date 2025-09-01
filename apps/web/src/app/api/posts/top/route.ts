import PostService from '@/services/post.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const limit = Number(request.nextUrl.searchParams.get('limit')) || 5;

        const postService = new PostService();

        // 점수 기반 상위 게시물 조회
        const postList = await postService.getTopPosts({ limit });
        return NextResponse.json(postList);
    } catch (error) {
        console.error('상위 게시글 조회 오류', error);
        return NextResponse.json({ error: '상위 게시글 조회 오류' }, { status: 500 });
    }
}
