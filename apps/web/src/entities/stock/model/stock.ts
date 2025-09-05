import { MarketCode, OverseasStockConditionSearchResponse, DbStock } from './types.server';
import { Stock } from './types';

export class StockModel {
    static toStock(stock: OverseasStockConditionSearchResponse['output2'][number], dbStock?: DbStock): Stock {
        return {
            id: dbStock?.id ?? 0,
            symbol: stock.symb,
            nameKo: stock.name,
            nameEn: stock.ename,
            price: Number(stock.last),
            change: Number(stock.diff),
            changeRate: stock.rate,
            market: stock.excd as MarketCode,
            sign: stock.sign as '1' | '2' | '3',
            rank: Number(stock.rank),
            logoUrl: dbStock?.logoUrl ?? '',
            sector: dbStock?.sector ?? '',
            subSector: dbStock?.subSector ?? '',
            summary: dbStock?.summary ?? '',
        };
    }
}
