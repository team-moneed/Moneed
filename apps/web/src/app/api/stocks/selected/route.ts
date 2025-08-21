import { TOKEN_ERROR } from '@/constants/token';
import { getSession } from '@/lib/session';
import { StockService } from '@/services/stock.service';
import { JWTExpired } from 'jose/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: TOKEN_ERROR.INVALID_TOKEN }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const count = parseInt(searchParams.get('count') || '20');
        const cursor = parseInt(searchParams.get('cursor') || '0');

        const stockService = new StockService();

        // cursor가 0이면 기본 getSelectedStock 사용 (기존 호환성 유지)
        const selectedStocks = await stockService.getSelectedStockWithPagination(session.userId, count, cursor);

        return NextResponse.json(selectedStocks);
    } catch (error) {
        if (error instanceof JWTExpired) {
            return NextResponse.json({ error: TOKEN_ERROR.EXPIRED_TOKEN }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
