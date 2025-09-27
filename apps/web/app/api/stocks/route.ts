import type { Stock } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { StockRepository } from '@/4_features/stock/server/repository';

export async function GET(request: NextRequest) {
    try {
        const count = Number(request.nextUrl.searchParams.get('count')) ?? 30;
        const cursor = Number(request.nextUrl.searchParams.get('cursor')) ?? 0;

        const stockRepository = new StockRepository();
        const stocks = await stockRepository.getStocks(count, cursor);

        return NextResponse.json<Stock[]>(stocks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
