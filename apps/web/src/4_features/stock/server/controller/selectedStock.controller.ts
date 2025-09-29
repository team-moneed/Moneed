import TokenCookie from '@/6_shared/utils/token.cookie';
import { StockService } from '@/4_features/stock/server/service/stock.service';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { StockRepository } from '../repository';
import { getOverseasStockPrice } from '../api';
import { verifyToken } from '@moneed/auth';
import { ERROR_MSG as AUTH_ERROR_MSG } from '@moneed/auth';
import { TOKEN_KEY } from '@/6_shared/config';

async function GET(request: NextRequest) {
    try {
        const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const searchParams = request.nextUrl.searchParams;
        const count = parseInt(searchParams.get('count') || '20');
        const cursor = parseInt(searchParams.get('cursor') || '0');

        const stockRepository = new StockRepository();
        const stockService = new StockService();
        const selectedStocks = await stockRepository.getSelectedStocks(userId, count, cursor);
        const stocks = await Promise.all(
            selectedStocks.map(stock => getOverseasStockPrice({ symbol: stock.stock.symbol })),
        );
        const apiStocks = stocks.map(stock => ({
            symb: stock.output.rsym.slice(4),
            last: stock.output.last,
            diff: stock.output.diff,
            rate: stock.output.rate,
            excd: 'NAS',
            sign: stock.output.sign,
            rank: undefined,
        }));
        const convertedStocks = await stockService.convertMultipleApiStocks(apiStocks);

        return NextResponse.json(convertedStocks);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export { GET };
