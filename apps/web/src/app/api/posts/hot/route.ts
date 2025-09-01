import PostService from '@/services/post.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const limit = Number(request.nextUrl.searchParams.get('limit')) || 5;
        const cursor = Number(request.nextUrl.searchParams.get('cursor')) || 0;

        const postService = new PostService();
        const postList = await postService.getHotPosts({ limit, cursor });
        return NextResponse.json(postList);
    } catch (error) {
        console.error('인기 게시글 조회 오류', error);
        return NextResponse.json({ error: '인기 게시글 조회 오류' }, { status: 500 });
    }
}
