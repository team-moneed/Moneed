import { MarketCode } from './types.server';

export type Stock = {
    id: number;
    symbol: string;
    nameKo: string;
    nameEn: string;
    price: number;
    change: number;
    changeRate: string;
    market: MarketCode;
    sign: '1' | '2' | '3';
    rank: number;
    logoUrl: string;
    sector: string;
    subSector: string;
    summary: string;
};
