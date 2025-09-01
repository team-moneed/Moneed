'use client';
import CategoryRankBox from '@/components/Community/CategoryRankBox';
import { useSuspenseHotStocks } from '@/queries/stock.query';
import withSuspense from '@/components/HOC/withSuspense';

export function HotStocks() {
    const { data: hotStocks } = useSuspenseHotStocks({ market: 'NAS' });
    return (
        <>
            {hotStocks.map(stock => (
                <CategoryRankBox stock={stock} key={stock.symbol} />
            ))}
        </>
    );
}

export default withSuspense(HotStocks, <div>Loading...</div>);
