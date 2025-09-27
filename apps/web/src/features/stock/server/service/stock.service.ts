import { StockModel } from '@/entities/stock';
import { StockRepository } from '../repository';
import { getOverseasStockPrice } from '../api';
import type { DbStock, ApiStockData, Stock } from '@/entities/stock';

export class StockService {
    private stockRepository: StockRepository;

    constructor() {
        this.stockRepository = new StockRepository();
    }

    /**
     * API 주식 데이터를 Stock 도메인 모델로 변환 (DB 정보 포함)
     * @param apiStock - API에서 받은 주식 데이터
     * @returns Stock 도메인 모델
     */
    async convertApiStockToStock(apiStock: ApiStockData): Promise<Stock> {
        const dbStock = await this.stockRepository.getStock(apiStock.symb);

        // DB에 주식 정보가 없는 경우 기본값으로 DbStock 생성
        const stockInfo: DbStock = dbStock ?? {
            id: 0,
            symbol: apiStock.symb,
            nameKo: '',
            nameEn: '',
            logoUrl: '',
            refUrl: null,
            sector: '',
            subSector: '',
            summary: '',
            nation: '',
        };

        return StockModel.toStock(apiStock, stockInfo);
    }

    /**
     * 여러 API 주식 데이터를 배치로 Stock 도메인 모델로 변환 (성능 최적화)
     * @param apiStocks - API에서 받은 주식 데이터 배열
     * @returns Stock 도메인 모델 배열
     */
    async convertMultipleApiStocks(apiStocks: ApiStockData[]): Promise<Stock[]> {
        // 배치로 DB 조회 (성능 최적화)
        const symbols = apiStocks.map(stock => stock.symb);
        const dbStocks = await this.stockRepository.getStocksBySymbols(symbols);

        // 심볼을 키로 하는 맵 생성
        const dbStockMap = new Map<string, DbStock>();
        dbStocks.forEach(dbStock => {
            dbStockMap.set(dbStock.symbol, dbStock);
        });

        // API 데이터를 Stock 모델로 변환
        return apiStocks.map(apiStock => {
            const dbStock = dbStockMap.get(apiStock.symb);

            // DB에 주식 정보가 없는 경우 기본값으로 DbStock 생성
            const stockInfo: DbStock = dbStock ?? {
                id: 0,
                symbol: apiStock.symb,
                nameKo: '',
                nameEn: '',
                logoUrl: '',
                refUrl: null,
                sector: '',
                subSector: '',
                summary: '',
                nation: '',
            };

            return StockModel.toStock(apiStock, stockInfo);
        });
    }

    /**
     * 사용자가 선택한 주식의 심볼 목록만 반환
     */
    async getSelectedStockSymbols(userId: string): Promise<string[]> {
        const selectedStocks = await this.stockRepository.getSelectedStocks(userId);
        return selectedStocks.map(stock => stock.stock.symbol);
    }

    async getOverseasStockPrice(symbol: string) {
        return await getOverseasStockPrice({ symbol });
    }
}
