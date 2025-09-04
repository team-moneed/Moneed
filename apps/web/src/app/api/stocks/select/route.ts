import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestCookies, assertAccessTokenPayload } from '@/utils/cookie.server';
import { StockService } from '@/features/stock/service/stock.server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants/message';

export async function POST(req: NextRequest) {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();
        assertAccessTokenPayload(accessTokenPayload);

        const { stockSymbols } = await req.json();
        const stockService = new StockService();
        await stockService.selectStock(accessTokenPayload.userId, stockSymbols);

        return NextResponse.json({ message: SUCCESS_MSG.STOCKS_SELECTED }, { status: 200 });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
