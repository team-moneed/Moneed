import { StockService } from '@/services/stock.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const symbol = req.nextUrl.searchParams.get('symbol') ?? null;

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    const stockService = new StockService();
    const stockPrice = await stockService.getOverseasStockPrice(symbol);

    return NextResponse.json(stockPrice);
}
