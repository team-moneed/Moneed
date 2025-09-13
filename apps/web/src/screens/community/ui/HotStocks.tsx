'use client';
import CategoryRankBox from '@/screens/community/ui/CategoryRankBox';
import { useSuspenseHotStocks } from '@/features/stock';
import withSuspense from '@/shared/ui/withSuspense';

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
