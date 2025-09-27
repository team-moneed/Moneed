import { NextRequest, NextResponse } from 'next/server';
import { PostService } from './post.service';
import { StockRepository } from '@/features/stock/server/repository';
import TokenCookie from '@/shared/utils/token.cookie';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/shared/config/message';
import { verifyToken } from '@moneed/auth';
import { ERROR_MSG as AUTH_ERROR_MSG } from '@moneed/auth';
import { TOKEN_KEY } from '@/shared/config';

export async function getHotPosts(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 5;
        const cursor = searchParams.get('cursor') ? Number(searchParams.get('cursor')) : null;

        const postService = new PostService();
        const posts = await postService.getHotPosts({ limit, cursor });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('인기 게시글 조회 오류', error);
        return NextResponse.json({ error: '인기 게시글 조회 오류' }, { status: 500 });
    }
}

export async function getPost({ postId }: { postId: number }) {
    try {
        const postService = new PostService();
        const post = await postService.getPostDetail({ postId });

        return NextResponse.json(post);
    } catch (error) {
        console.error('게시글 조회 오류', error);
        return NextResponse.json({ error: '게시글 조회 오류' }, { status: 500 });
    }
}

export async function getTopStockPosts(request: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
    try {
        const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
        const symbol = (await params).symbol;

        const postService = new PostService();
        const stockRepository = new StockRepository();

        const stock = await stockRepository.getStock(symbol);
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

export async function getTopPosts(request: NextRequest) {
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

export async function getPosts(req: NextRequest) {
    try {
        const symbol = req.nextUrl.searchParams.get('symbol');
        const cursor = req.nextUrl.searchParams.get('cursor');
        const limit = req.nextUrl.searchParams.get('limit');

        const postService = new PostService();
        const stockRepository = new StockRepository();

        if (!symbol) {
            throw new ResponseError(400, ERROR_MSG.SYMBOL_REQUIRED);
        }

        // symbol로 주식을 조회하여 stockId를 얻습니다
        const stock = await stockRepository.getStock(symbol);
        if (!stock) {
            throw new ResponseError(404, ERROR_MSG.STOCK_NOT_FOUND);
        }

        const posts = await postService.getPosts({
            symbol: stock.symbol,
            limit: limit ? Number(limit) : 15,
            cursor: cursor ? new Date(cursor) : new Date(),
        });

        return NextResponse.json(posts);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        console.error('게시글 조회 오류', error);
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}

// 게시글 작성
export async function createPost(req: NextRequest) {
    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const symbol = formData.get('symbol') as string;
        const thumbnailImage = formData.get('thumbnailImage') as File;

        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const stockRepository = new StockRepository();
        const postService = new PostService();

        // symbol로 주식을 조회하여 stockId를 얻습니다
        const stock = await stockRepository.getStock(symbol);
        if (!stock) {
            return NextResponse.json({ error: ERROR_MSG.STOCK_NOT_FOUND }, { status: 404 });
        }

        const post = await postService.createPost({
            userId,
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
