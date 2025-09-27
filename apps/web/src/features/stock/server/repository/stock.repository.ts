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
