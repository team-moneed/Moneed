export type { Stock as DbStock } from '@prisma/client';

export type MarketCode = 'NYS' | 'NAS' | 'AMS' | 'TSE' | 'HKS' | 'SHS' | 'SZS' | 'HSX' | 'HNX';

/**
 * API에서 받은 주식 데이터 (Stock 모델 변환용)
 */
export type ApiStockData = {
    symb: string; // 종목코드 (symbol)
    last: string; // 현재가 (price)
    diff: string; // 대비 (change)
    rate: string; // 등락율 (changeRate)
    excd?: string; // 거래소코드 (market)
    sign: '1' | '2' | '3' | '4' | '5'; // 대비기호 (1: 상한, 2: 상승, 3:보합, 4:하한, 5:하락)
    rank?: string; // 순위 (rank)
};

export type Stock = {
    id: number;
    symbol: string;
    nameKo: string;
    nameEn: string;
    price: number;
    change: number;
    changeRate: string;
    market: MarketCode;
    sign: '1' | '2' | '3' | '4' | '5';
    rank: number;
    logoUrl: string;
    sector: string;
    subSector: string;
    summary: string;
};
