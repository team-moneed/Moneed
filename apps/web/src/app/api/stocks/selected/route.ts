import { verifyRequestCookies } from '@/utils/cookie.server';
import { StockService } from '@/services/stock.service';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG } from '@/constants/message';

export async function GET(request: NextRequest) {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        if (!accessTokenPayload) {
            return NextResponse.json({ error: ERROR_MSG.UNAUTHORIZED }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const count = parseInt(searchParams.get('count') || '20');
        const cursor = parseInt(searchParams.get('cursor') || '0');

        const stockService = new StockService();

        const selectedStocks = await stockService.getSelectedStockWithPagination(
            accessTokenPayload.userId,
            count,
            cursor,
        );

        return NextResponse.json(selectedStocks);
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
