'use client';

import { useParams } from 'next/navigation';
import { ChipLink } from '@/6_shared/ui/Chip';
import Icon from '@/6_shared/ui/Icon';
import Link from 'next/link';
import { useInfiniteMyStocks } from '@/4_features/user/query';
import { useIntersectionObserver } from '@/6_shared/hooks/useIntersectionObserver';
import ChipSkeleton from '@/6_shared/ui/Skeletons/ChipSkeleton';
import { useAuth } from '@/6_shared/hooks/useAuth';
import { PATH } from '@/6_shared/config';

export default function StockTypeBar() {
    const params = useParams();
    const symbol = params ? params.symbol : undefined;
    const { accessToken } = useAuth();
    const {
        data: stocks,
        isLoading,
        fetchNextPage,
        hasNextPage,
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
        <div className='relative'>
            <div className='flex gap-4 mb-6 overflow-x-auto whitespace-nowrap items-center'>
                <Link href={PATH.SELECTSTOCKTYPE} className='shrink-0'>
                    <Icon iconUrl='/icon/plus-circle.svg' width={30} height={30} />
                </Link>
                <ChipLink label='전체' active={symbol ? false : true} href={PATH.COMMUNITY} />
                {stocks?.map(stock => (
                    <ChipLink
                        key={stock.symbol}
                        label={stock.nameKo}
                        active={symbol ? symbol === stock.symbol : false}
                        href={`${PATH.COMMUNITY}/${stock.symbol}`}
                    />
                ))}
                {(isLoading || isFetchingNextPage) &&
                    Array.from({ length: 10 }).map((_, i) => <ChipSkeleton key={i} />)}
                <div className='w-[10px] h-[10px] shrink-0' ref={ref}></div>
            </div>
        </div>
    );
}
