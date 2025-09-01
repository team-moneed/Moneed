import { StockService } from '@/services/stock.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
    try {
        const { symbol } = await params;

        if (!symbol) {
            return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }

        const stockService = new StockService();
        const stock = await stockService.getStockBySymbol(symbol);

        return NextResponse.json(stock);
    } catch (error) {
        if (error instanceof Error && error.message === 'Stock not found') {
            return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
