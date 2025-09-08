import MyStockBox from '@/_pages/mypage/ui/MyStockBox';
import { StockBoxSkeletons } from '@/components/Skeletons/mypage/StockBoxSkeleton';
import { useInfiniteMyStocks } from '../query';
import { useAuth } from '@/shared/hooks/useAuth';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';

export default function MyStocks() {
    const { accessToken } = useAuth();
    const {
        data: myStocks = [],
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
    } = useInfiniteMyStocks({ count: 10, enabled: !!accessToken });

    const ref = useIntersectionObserver({
        onIntersect: () => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        options: {
            rootMargin: '100px',
            threshold: 0.1,
        },
    });

    return (
        <section className='space-y-[.8rem] overflow-y-auto h-full max-h-[500px]'>
            {myStocks.map(stock => (
                <MyStockBox key={stock.symbol} stock={stock} href={`/community/${stock.symbol}`} />
            ))}
            <div className='h-[10px]' ref={ref}></div>
            {(isLoading || isFetchingNextPage) && <StockBoxSkeletons count={10} />}
        </section>
    );
}
