import { getHotStock, getOverseasStockPrice, getStocks, getStockBySymbol } from '../api';
import { MarketCode } from '@/entities/stock';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useStocks = () => {
    return useQuery({
        queryKey: ['stocks'],
        queryFn: () => getStocks(),
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
