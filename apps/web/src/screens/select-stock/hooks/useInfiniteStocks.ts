import { getStocks } from '@/features/stock';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteStocks = ({ count = 20 }: { count?: number }) => {
    return useInfiniteQuery({
        queryKey: ['stocks'],
        queryFn: ({ pageParam = 0 }) => getStocks({ count, cursor: pageParam }),
        getNextPageParam: lastPage => (lastPage.length > 0 ? (lastPage.at(-1)?.id ?? 0) : undefined),
        initialPageParam: 0,
        select: data => data.pages.flatMap(page => page),
    });
};
