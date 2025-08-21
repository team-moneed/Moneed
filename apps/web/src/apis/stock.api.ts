import { httpWithCredentials, http } from '@/apis/client';
import { Stock } from '@/generated/prisma';
import { MarketCode, OverseasStockPriceResponse } from '@/types/kis';
import { HotStock } from '@/types/stock';

export async function getStocks({ count = 30, cursor = 0 }: { count?: number; cursor?: number } = {}) {
    const res = await http.get<Stock[]>('/api/stocks', { params: { count, cursor } });
    return res.data;
}

export async function selectStock(stockSymbols: string[]) {
    const res = await httpWithCredentials.post('/api/stocks/select', { stockSymbols });
    return res.data;
}

export async function getSelectedStocks({ count = 20, cursor = 0 }: { count?: number; cursor?: number } = {}) {
    const res = await httpWithCredentials.get<Stock[]>('/api/stocks/selected', {
        params: { count, cursor },
    });
    return res.data;
}

export async function getOverseasStockPrice({ symbol }: { symbol: string }) {
    const res = await http.get<OverseasStockPriceResponse>(`/api/stocks/price/overseas`, {
        params: { symbol },
    });
    return res.data;
}

export async function getHotStock({ market }: { market: MarketCode }) {
    const res = await http.get<HotStock[]>('/api/stocks/hot', {
        params: { market },
    });
    return res.data;
}

export async function getStockBySymbol({ symbol }: { symbol: string }) {
    const res = await http.get<Stock>(`/api/stocks/${symbol}`);
    return res.data;
}
