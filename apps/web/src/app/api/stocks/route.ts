import { Stock } from '@/generated/prisma';
import { StockService } from '@/services/stock.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const count = Number(request.nextUrl.searchParams.get('count')) ?? 30;
        const cursor = Number(request.nextUrl.searchParams.get('cursor')) ?? 0;

        const stockService = new StockService();
        const stocks = await stockService.getStocks(count, cursor);

        return NextResponse.json<Stock[]>(stocks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
