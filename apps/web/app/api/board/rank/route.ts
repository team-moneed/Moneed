import { NextRequest } from 'next/server';
import { PostService } from '@/4_features/post/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const postService = new PostService();

    const limit = Number(request.nextUrl.searchParams.get('limit')) || 3;

    const boardRanks = await postService.getBoardRank({ limit });
    return NextResponse.json(boardRanks);
}
