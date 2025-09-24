import { prisma } from '@/shared/model';
import { DbStock } from '@/entities/stock';

export class StockRepository {
    private prisma = prisma;

    async getSelectedStocks(userId: string, count?: number, cursor?: number) {
        return this.prisma.selectedStock.findMany({
            where: {
                userId,
                id: cursor !== undefined ? { gt: cursor } : undefined,
            },
            include: {
                stock: true,
            },
            take: count,
            orderBy: count !== undefined ? { id: 'asc' } : undefined,
        });
    }

    async selectStock(userId: string, stockSymbols: string[]) {
        // 트랜잭션을 사용하여 기존 선택된 주식을 모두 삭제하고 새로운 주식들을 추가
        return this.prisma.$transaction(async tx => {
            // 기존 선택된 주식들을 모두 삭제
            await tx.selectedStock.deleteMany({
                where: {
                    userId,
                },
            });

            // 새로운 주식들을 추가
            if (stockSymbols.length > 0) {
                await tx.selectedStock.createMany({
                    data: stockSymbols.map(stockSymbol => ({
                        userId,
                        stockSymbol,
                    })),
                    skipDuplicates: true,
                });
            }
        });
    }

    async getStock(symbol: string) {
        return this.prisma.stock.findUnique({
            where: {
                symbol,
            },
        });
    }

    async getStocks(count: number, cursor: number) {
        return this.prisma.stock.findMany({
            where: {
                id: {
                    gt: cursor,
                },
            },
            take: count,
        });
    }

    async getStocksBySymbols(symbols: string[]): Promise<DbStock[]> {
        return this.prisma.stock.findMany({
            where: {
                symbol: { in: symbols },
            },
        });
    }
}
