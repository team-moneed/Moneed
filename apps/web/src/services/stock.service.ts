import { getOverseasStockInfo, getOverseasStockPrice } from '@/apis/kis.api';
import { Stock } from '@/generated/prisma';
import { StockRepository } from '@/repositories/stock.repository';

export class StockService {
    private stockRepository: StockRepository;

    constructor() {
        this.stockRepository = new StockRepository();
    }

    /**
     * 단일 주식에 대한 정보를 가져와서 name 필드를 추가합니다.
     */
    async getKoreanStockName(symbol: string) {
        try {
            const info = await getOverseasStockInfo({ symbol });
            return info.output.prdt_name;
        } catch (error) {
            console.error(`Failed to get stock info for ${symbol}:`, error);
            return symbol;
        }
    }

    /**
     * 여러 주식에 대한 정보를 병렬로 가져와서 name 필드를 추가합니다.
     */
    async updateStockNamesToKorean(stocks: Stock[]) {
        return await Promise.all(
            stocks.map(async stock => ({
                ...stock,
                name: await this.getKoreanStockName(stock.symbol),
            })),
        );
    }

    async getSelectedStock(userId: string) {
        const selectedStocks = await this.stockRepository.getSelectedStock(userId);
        return await this.updateStockNamesToKorean(selectedStocks.flatMap(stock => stock.stock));
    }

    async getSelectedStockWithPagination(userId: string, count: number, cursor: number) {
        const selectedStocks = await this.stockRepository.getSelectedStockWithPagination(userId, count, cursor);
        const selectedStocksInKorean = await this.updateStockNamesToKorean(
            selectedStocks.flatMap(stock => stock.stock),
        );
        return selectedStocksInKorean.map(stock => ({
            ...stock,
            id: selectedStocks.find(s => s.stock.symbol === stock.symbol)?.id,
        }));
    }

    async selectStock(userId: string, stockSymbols: string[]) {
        await this.stockRepository.selectStock(userId, stockSymbols);
    }

    async getStock(stockId: number) {
        const stock = await this.stockRepository.getStock(stockId);
        if (!stock) {
            throw new Error('Stock not found');
        }
        return {
            ...stock,
            name: await this.getKoreanStockName(stock.symbol),
        };
    }

    async getStocks(count: number, cursor: number) {
        const stocks = await this.stockRepository.getStocks(count, cursor);
        return await this.updateStockNamesToKorean(stocks);
    }

    async getOverseasStockPrice(symbol: string) {
        return await getOverseasStockPrice({ symbol });
    }

    async getStocksBySymbols(symbols: string[]) {
        const stocks = await this.stockRepository.getStocksBySymbols(symbols);
        return await this.updateStockNamesToKorean(stocks);
    }

    async getStockBySymbol(symbol: string) {
        const stock = await this.stockRepository.getStockBySymbol(symbol);
        if (!stock) {
            throw new Error('Stock not found');
        }
        return {
            ...stock,
            name: await this.getKoreanStockName(stock.symbol),
        };
    }
}
