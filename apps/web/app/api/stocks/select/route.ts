import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from '@/shared/utils/cookie.server';
import { StockService } from '@/features/stock/server/service/stock.service';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/shared/config/message';
import { verifyToken } from '@moneed/auth';
import { ERROR_MSG as AUTH_ERROR_MSG } from '@moneed/auth';

export async function POST(req: NextRequest) {
    try {
        const accessToken = await getCookie(process.env.JWT_ACCESS_NAME || 'access_token');
        if (!accessToken) {
            throw new ResponseError(401, AUTH_ERROR_MSG.NO_ACCESS_TOKEN);
        }
        const sessionResult = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
        if (sessionResult.error) {
            throw sessionResult.error;
        }
        const userId = sessionResult.data.id;

        const { stockSymbols } = await req.json();
        const stockService = new StockService();
        await stockService.selectStock(userId, stockSymbols);

        return NextResponse.json({ message: SUCCESS_MSG.STOCKS_SELECTED }, { status: 200 });
    } catch (error) {
        if (error instanceof ResponseError) {
            return NextResponse.json({ error: error.message }, { status: error.code });
        }
        return NextResponse.json({ error: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
    }
}
