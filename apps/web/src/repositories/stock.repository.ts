import { prisma } from '@moneed/db';

export class StockRepository {
    private prisma = prisma;

    async getSelectedStock(userId: string) {
        return this.prisma.selectedStock.findMany({
            where: {
                userId,
            },
            include: {
                stock: true,
            },
        });
    }

    async getSelectedStockWithPagination(userId: string, count: number, cursor: number) {
        return this.prisma.selectedStock.findMany({
            where: {
                userId,
                id: {
                    gt: cursor,
                },
            },
            include: {
                stock: true,
            },
            take: count,
            orderBy: {
                id: 'asc',
            },
        });
    }

    async selectStock(userId: string, stockSymbols: string[]) {
        return this.prisma.selectedStock.createMany({
            data: stockSymbols.map(stockSymbol => ({
                userId,
                stockSymbol,
            })),
            skipDuplicates: true,
        });
    }

    async getStock(stockId: number) {
        return this.prisma.stock.findUnique({
            where: {
                id: stockId,
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

    async getStocksBySymbols(symbols: string[]) {
        return this.prisma.stock.findMany({
            where: {
                symbol: { in: symbols },
            },
        });
    }

    async getStockBySymbol(symbol: string) {
        return this.prisma.stock.findFirst({
            where: {
                symbol,
            },
        });
    }
}
