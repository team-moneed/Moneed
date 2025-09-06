import { MarketCode, DbStock, ApiStockData } from './types.server';
import { Stock } from './types';

export class StockModel {
    /**
     * API 응답 데이터를 Stock 도메인 모델로 변환
     * @param apiStock - API에서 받은 주식 데이터
     * @param dbStock - 데이터베이스에서 조회한 주식 정보 (옵셔널)
     * @returns Stock 도메인 모델
     */
    static toStock(apiStock: ApiStockData, dbStock: DbStock): Stock {
        return {
            id: dbStock.id,
            nameKo: dbStock.nameKo,
            nameEn: dbStock.nameEn,
            logoUrl: dbStock.logoUrl,
            sector: dbStock.sector,
            subSector: dbStock.subSector,
            summary: dbStock.summary,
            symbol: dbStock.symbol,
            price: Number(apiStock.last),
            change: Number(apiStock.diff),
            changeRate: apiStock.rate,
            market: apiStock.excd as MarketCode,
            sign: apiStock.sign as ApiStockData['sign'],
            rank: Number(apiStock.rank),
        };
    }
}
