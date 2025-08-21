import { getHotStock, getOverseasStockPrice, getSelectedStocks, getStocks, getStockBySymbol } from '@/apis/stock.api';
import { MarketCode } from '@/types/kis';
import { useInfiniteQuery, useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useStocks = () => {
    return useQuery({
        queryKey: ['stocks'],
        queryFn: () => getStocks(),
    });
};

export const useInfiniteStocks = ({ count = 20 }: { count?: number }) => {
    return useInfiniteQuery({
        queryKey: ['stocks'],
        queryFn: ({ pageParam = 0 }) => getStocks({ count, cursor: pageParam }),
        getNextPageParam: lastPage => (lastPage.length > 0 ? (lastPage.at(-1)?.id ?? 0) : undefined),
        initialPageParam: 0,
        select: data => data.pages.flatMap(page => page),
    });
};

// TODO: infinite query로 수정
export const useSelectedStocks = () => {
    return useQuery({
        queryKey: ['selectedStocks'],
        queryFn: () => getSelectedStocks(),
        retry: (failureCount, error: any) => {
            // 401 에러인 경우 재시도하지 않음
            if (error?.response?.status === 401) {
                return false;
            }
            // 다른 에러의 경우 최대 3번 재시도
            return failureCount < 3;
        },
    });
};

export const useInfiniteSelectedStocks = ({ count = 20 }: { count?: number } = {}) => {
    return useInfiniteQuery({
        queryKey: ['selectedStocks', 'infinite'],
        queryFn: ({ pageParam = 0 }) => getSelectedStocks({ count, cursor: pageParam }),
        getNextPageParam: lastPage => (lastPage.length > 0 ? lastPage.at(-1)?.id : undefined),
        initialPageParam: 0,
        select: data => data.pages.flatMap(page => page),
        retry: (failureCount, error: any) => {
            // 401 에러인 경우 재시도하지 않음
            if (error?.response?.status === 401) {
                return false;
            }
            // 다른 에러의 경우 최대 3번 재시도
            return failureCount < 3;
        },
    });
};

export const useSuspenseSelectedStocks = () => {
    return useSuspenseQuery({
        queryKey: ['selectedStocks'],
        queryFn: () => getSelectedStocks(),
        retry: (failureCount, error: any) => {
            // 401 에러인 경우 재시도하지 않음
            if (error?.response?.status === 401) {
                return false;
            }
            // 다른 에러의 경우 최대 3번 재시도
            return failureCount < 3;
        },
    });
};

export const useOverseasStockPrice = ({ symbol }: { symbol: string }) => {
    return useQuery({
        queryKey: ['stock-price-overseas', symbol],
        queryFn: () => getOverseasStockPrice({ symbol }),
    });
};

export const useSuspenseOverseasStockPrice = ({ symbol }: { symbol: string }) => {
    return useSuspenseQuery({
        queryKey: ['stock-price-overseas', symbol],
        queryFn: () => getOverseasStockPrice({ symbol }),
        refetchInterval: 1000 * 60, // 1분마다 리패칭
    });
};

export const useSuspenseHotStocks = ({ market }: { market: MarketCode }) => {
    return useSuspenseQuery({
        queryKey: ['hot-stocks', market],
        queryFn: () => getHotStock({ market }),
    });
};

export const useStockBySymbol = ({ symbol }: { symbol: string }) => {
    return useQuery({
        queryKey: ['stock-by-symbol', symbol],
        queryFn: () => getStockBySymbol({ symbol }),
        enabled: !!symbol,
    });
};
