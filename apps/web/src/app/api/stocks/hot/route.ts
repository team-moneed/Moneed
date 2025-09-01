import { getOverseasStockByCondition } from '@/apis/kis.api';
import { StockService } from '@/services/stock.service';
import { MarketCode } from '@/types/kis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const market = request.nextUrl.searchParams.get('market');
    if (!market) {
        return NextResponse.json({ error: 'market is required' }, { status: 400 });
    }
    const data = await getOverseasStockByCondition({ market: market as MarketCode });
    const top3Stocks = data.output2.slice(0, 3);
    const stockService = new StockService();
    const stocks = await stockService.getStocksBySymbols(top3Stocks.map(stock => stock.symb));
    const hotStocks = top3Stocks.map((stock, i) => ({
        symbol: stock.symb,
        name: stock.name,
        price: Number(stock.last),
        change: Number(stock.diff),
        changeRate: stock.rate,
        market: stock.excd as MarketCode,
        sign: stock.sign as '1' | '2' | '3',
        rank: Number(stock.rank),
        logoUrl: stocks[i]?.logoUrl,
        sector: stocks[i]?.sector,
    }));

    return NextResponse.json(hotStocks);
}
