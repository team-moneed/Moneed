import { prisma } from '@/6_shared/model';

export async function updateSelectedStocks(userId: string, stockSymbols: string[]) {
    // 트랜잭션을 사용하여 기존 선택된 주식을 모두 삭제하고 새로운 주식들을 추가
    return prisma.$transaction(async tx => {
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
