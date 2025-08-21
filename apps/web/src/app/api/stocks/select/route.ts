import { TOKEN_ERROR } from '@/constants/token';
import { JWTExpired } from 'jose/errors';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { StockService } from '@/services/stock.service';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: TOKEN_ERROR.INVALID_TOKEN }, { status: 401 });
        }

        const { stockSymbols } = await req.json();
        const stockService = new StockService();
        await stockService.selectStock(session.userId, stockSymbols);

        return NextResponse.json({ message: 'Selected stocks updated' }, { status: 200 });
    } catch (error) {
        if (error instanceof JWTExpired) {
            return NextResponse.json({ error: TOKEN_ERROR.EXPIRED_TOKEN }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
