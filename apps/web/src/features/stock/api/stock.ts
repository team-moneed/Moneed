import { http } from '@/shared/api/client';
import type { OverseasStockPriceResponse } from '../server';
import type { Stock, DbStock, MarketCode } from '@/entities/stock';
import { API_PATH } from '@/shared/config';

export async function getStocks({ count = 30, cursor = 0 }: { count?: number; cursor?: number } = {}) {
    const res = await http.get<Stock[]>(API_PATH.STOCKS, { params: { count, cursor } });
    return res.data;
}

export async function selectStock(stockSymbols: string[]) {
    const res = await http.post(API_PATH.STOCKS_SELECT, { stockSymbols });
    return res.data;
}

export async function getOverseasStockPrice({ symbol }: { symbol: string }) {
    const res = await http.get<OverseasStockPriceResponse>(API_PATH.STOCKS_PRICE_OVERSEAS, {
        params: { symbol },
    });
    return res.data;
}

export async function getHotStock({ market }: { market: MarketCode }) {
    const res = await http.get<Stock[]>(API_PATH.STOCKS_HOT, {
        params: { market },
    });
    return res.data;
}

export async function getStockBySymbol({ symbol }: { symbol: string }) {
    const res = await http.get<DbStock>(`${API_PATH.STOCKS}/${symbol}`);
    return res.data;
}
