import MyStockBox from '@/components/Mypage/MyStockBox';
import { StockBoxSkeletons } from '@/components/Skeletons/mypage/StockBoxSkeleton';
import { useInfiniteSelectedStocks } from '@/queries/stock.query';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function SelectedStocks() {
    const {
        data: selectedStocks = [],
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage,
    } = useInfiniteSelectedStocks({ count: 10 });

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
            {selectedStocks.map(stock => (
                <MyStockBox key={stock.id} stock={stock} href={`/community/${stock.symbol}`} />
            ))}
            <div className='h-[10px]' ref={ref}></div>
            {(isLoading || isFetchingNextPage) && <StockBoxSkeletons count={10} />}
        </section>
    );
}
