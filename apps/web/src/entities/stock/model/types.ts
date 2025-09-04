import { MarketCode } from './types.server';

export type HotStock = {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changeRate: string;
    market: MarketCode;
    sign: '1' | '2' | '3';
    rank: number;
    logoUrl: string;
    sector: string;
};
