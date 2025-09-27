'use client';
import CategoryRankBox from '@/2_screens/community/ui/CategoryRankBox';
import { useSuspenseHotStocks } from '@/4_features/stock';
import withSuspense from '@/6_shared/ui/withSuspense';

function HotStocks() {
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
