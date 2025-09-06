import { getOverseasStockByCondition, type MarketCode } from '@/entities/stock/server';
import { StockService } from '@/features/stock/service/stock.server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const market = request.nextUrl.searchParams.get('market');
        if (!market) {
            return NextResponse.json({ error: 'market is required' }, { status: 400 });
        }

        const data = await getOverseasStockByCondition({
            market: market as MarketCode,
            params: {
                CO_YN_RATE: '1',
                CO_ST_RATE: '0.1',
                CO_EN_RATE: String(10_000), // 등락율 끝율
                CO_YN_VALX: '1', // 시가총액 조건 사용 여부 (1: 사용, 0: 사용안함)
                CO_ST_VALX: String(50_000_000), // 시가총액 시작값 (단위: 천$) -> 500억$
                CO_EN_VALX: String(5_000_000_000), // 시가총액 끝값 (단위: 천$) -> 5조$
            },
        });

        const top3Stocks = data.output2.slice(0, 3);
        const stockService = new StockService();
        const hotStocks = await stockService.convertMultipleApiStocks(top3Stocks);

        return NextResponse.json(hotStocks);
    } catch (error) {
        console.error('Error in hot stocks API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
