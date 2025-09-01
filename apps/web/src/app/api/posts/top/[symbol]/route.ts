import PostService from '@/services/post.service';
import { StockService } from '@/services/stock.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
    try {
        const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
        const symbol = (await params).symbol;

        const postService = new PostService();
        const stockService = new StockService();

        const stock = await stockService.getStockBySymbol(symbol);
        if (!stock) {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }

        const postList = await postService.getBoardTopPosts({ symbol, limit });

        return NextResponse.json(postList);
    } catch (error) {
        console.error('게시글 조회 오류', error);
        return NextResponse.json({ error: '게시글 조회 오류' }, { status: 500 });
    }
}
