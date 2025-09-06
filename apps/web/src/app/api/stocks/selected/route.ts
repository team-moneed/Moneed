import { verifyRequestCookies } from '@/shared/utils/cookie.server';
import { StockService } from '@/features/stock/service/stock.server';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/shared/config/message';
import { getOverseasStockPrice, StockRepository } from '@/entities/stock/server';

export async function GET(request: NextRequest) {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        if (!accessTokenPayload) {
            return NextResponse.json({ error: ERROR_MSG.UNAUTHORIZED }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const count = parseInt(searchParams.get('count') || '20');
        const cursor = parseInt(searchParams.get('cursor') || '0');

        const stockRepository = new StockRepository();
        const stockService = new StockService();
        const selectedStocks = await stockRepository.getSelectedStocks(accessTokenPayload.userId, count, cursor);
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
