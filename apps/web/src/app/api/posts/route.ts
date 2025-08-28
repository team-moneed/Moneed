import { verifyRequestCookies } from '@/utils/cookie';
import PostService from '@/services/post.service';
import { StockService } from '@/services/stock.service';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/message';

export async function GET(req: NextRequest) {
    try {
        const symbol = req.nextUrl.searchParams.get('symbol');
        const cursor = req.nextUrl.searchParams.get('cursor');
        const limit = req.nextUrl.searchParams.get('limit');

        // Optional authentication for GETlet userId: string | undefined;
        const { accessTokenPayload } = await verifyRequestCookies();
        const userId = accessTokenPayload.userId;

        const postService = new PostService();
        const stockService = new StockService();

        if (!symbol) {
            return NextResponse.json({ error: ERROR_MSG.SYMBOL_REQUIRED }, { status: 400 });
        }

        // symbol로 주식을 조회하여 stockId를 얻습니다
        const stock = await stockService.getStockBySymbol(symbol);
        if (!stock) {
            return NextResponse.json({ error: ERROR_MSG.STOCK_NOT_FOUND }, { status: 404 });
        }

        const postThumbnailList = await postService.getPostsWithUserExtended({
            stockSymbol: stock.symbol,
            limit: limit ? Number(limit) : 15,
            cursor: cursor ? new Date(cursor) : new Date(),
            userId,
        });

        return NextResponse.json(postThumbnailList);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        console.error('게시글 조회 오류', error);
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

// 게시글 작성
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const symbol = formData.get('symbol') as string;
        const thumbnailImage = formData.get('thumbnailImage') as File;

        const { accessTokenPayload } = await verifyRequestCookies();

        const stockService = new StockService();
        const postService = new PostService();

        // symbol로 주식을 조회하여 stockId를 얻습니다
        const stock = await stockService.getStockBySymbol(symbol);
        if (!stock) {
            return NextResponse.json({ error: ERROR_MSG.STOCK_NOT_FOUND }, { status: 404 });
        }

        const post = await postService.createPost({
            userId: accessTokenPayload.userId,
            title,
            content,
            symbol,
            thumbnailImage,
        });

        return NextResponse.json(
            {
                message: SUCCESS_MSG.POST_CREATED,
                post,
            },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
