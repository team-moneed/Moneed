'use client';

import { useParams } from 'next/navigation';
import { ChipLink } from '@/components/Chip';
import Icon from '@/components/Icon';
import Link from 'next/link';
import { useInfiniteSelectedStocks } from '@/queries/stock.query';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import ChipSkeleton from '@/components/Skeletons/ChipSkeleton';
import { useAuth } from '@/hooks/useAuth';

function StockTypeBar() {
    const params = useParams();
    const symbol = params ? params.symbol : undefined;
    const { accessToken } = useAuth();
    const {
        data: stocks,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteSelectedStocks({ count: 10, accessToken: accessToken });

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
        <div className='relative'>
            <div className='flex gap-4 mb-6 overflow-x-auto whitespace-nowrap items-center'>
                <Link href='/selectstocktype' className='shrink-0'>
                    <Icon iconUrl='/icon/icon-addcircle.svg' width={30} height={30} />
                </Link>
                <ChipLink label='전체' active={symbol ? false : true} href='/community' />
                {stocks?.map(stock => (
                    <ChipLink
                        key={stock.symbol}
                        label={stock.name}
                        active={symbol ? symbol === stock.symbol : false}
                        href={`/community/${stock.symbol}`}
                    />
                ))}
                {(isLoading || isFetchingNextPage) &&
                    Array.from({ length: 10 }).map((_, i) => <ChipSkeleton key={i} />)}
                <div className='w-[10px] h-[10px] shrink-0' ref={ref}></div>
            </div>
        </div>
    );
}

export default StockTypeBar;
