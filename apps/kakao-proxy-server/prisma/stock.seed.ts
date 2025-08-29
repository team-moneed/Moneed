import { PrismaClient } from '@prisma/client';
import { stockData } from './stockdata';

const prisma = new PrismaClient();

export async function seedStocks() {
    console.log('🚀 Stock 데이터 생성 시작...');

    let stocksCreated = 0;
    for (const stock of stockData) {
        const existingStock = await prisma.stock.findFirst({
            where: {
                OR: [{ symbol: stock.symbol }, { name: stock.name }],
            },
        });

        if (existingStock) {
            console.log(`⚠️  '${stock.name}' (${stock.symbol})은(는) 이미 존재합니다.`);
            continue;
        }

        await prisma.stock.create({
            data: {
                symbol: stock.symbol,
                name: stock.name,
                sector: stock.sector,
                subSector: stock.subSector ?? '',
                summary: stock.summary,
                logoUrl: stock.logoUrl ?? '',
                refUrl: stock.refUrl,
            },
        });
        console.log(`✅ '${stock.name}' (${stock.symbol}) 생성 완료`);
        stocksCreated++;
    }

    console.log(`📊 Stock 생성 완료: ${stocksCreated}개 추가됨\n`);
}

async function main() {
    await seedStocks();
}

main()
    .catch(e => {
        console.error('❌ 에러 발생:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
