import { getSession } from '@/lib/session';
import PostService from '@/services/post.service';
import { StockService } from '@/services/stock.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const symbol = req.nextUrl.searchParams.get('symbol');
        const cursor = req.nextUrl.searchParams.get('cursor');
        const limit = req.nextUrl.searchParams.get('limit');
        const payload = await getSession();

        const postService = new PostService();
        const stockService = new StockService();

        if (!symbol) {
            return NextResponse.json({ error: 'symbol is required' }, { status: 400 });
        }

        // symbol로 주식을 조회하여 stockId를 얻습니다
        const stock = await stockService.getStockBySymbol(symbol);
        if (!stock) {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }

        const postThumbnailList = await postService.getPostsWithUserExtended({
            stockSymbol: stock.symbol,
            limit: limit ? Number(limit) : 15,
            cursor: cursor ? new Date(cursor) : new Date(),
            userId: payload?.userId,
        });

        return NextResponse.json(postThumbnailList);
    } catch (error) {
        console.error('게시글 조회 오류', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// 게시글 작성
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const symbol = formData.get('symbol') as string;
    const thumbnailImage = formData.get('thumbnailImage') as File;

    const payload = await getSession();
    if (!payload) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stockService = new StockService();
    const postService = new PostService();

    // symbol로 주식을 조회하여 stockId를 얻습니다
    const stock = await stockService.getStockBySymbol(symbol);
    if (!stock) {
        return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    const post = await postService.createPost({
        userId: payload.userId,
        title,
        content,
        symbol,
        thumbnailImage,
    });

    return NextResponse.json(
        {
            message: '게시글이 작성되었습니다.',
            post,
        },
        { status: 201 },
    );
}
