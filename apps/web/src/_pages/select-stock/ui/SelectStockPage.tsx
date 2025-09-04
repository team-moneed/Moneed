'use client';

import Button from '@/shared/ui/Button';
import StockTypeChip from './StockChip';
import { selectStock as selectStockApi, useSelectedStocks } from '@/entities/stock';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteStocks } from '../hooks';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';

export function SelectStockPage() {
    const router = useRouter();
    const { data: stocks = [], fetchNextPage, hasNextPage } = useInfiniteStocks({ count: 50 });
    const searchParams = useSearchParams();
    const ref = useIntersectionObserver({
        onIntersect: () => {
            if (hasNextPage) {
                fetchNextPage();
            }
        },
    });

    const { data: mySelectedStocks, error: selectedStocksError } = useSelectedStocks();
    // 401 에러가 아닌 경우에만 선택된 주식 목록 사용
    const is401Error = selectedStocksError?.response?.status === 401;
    const mySelectedStockSymbols = !is401Error ? mySelectedStocks?.flatMap(stock => stock.symbol) : [];

    const { mutate: selectStock } = useMutation({
        mutationFn: (stockSymbols: string[]) => selectStockApi(stockSymbols),
    });
    const [stockSymbols, setStockSymbols] = useState<string[]>([]);
    const selectedStocks = [...stockSymbols, ...(mySelectedStockSymbols ?? [])];

    const toggleStock = (stockSymbol: string) => {
        if (selectedStocks.includes(stockSymbol)) {
            setStockSymbols(stockSymbols.filter(symbol => symbol !== stockSymbol));
        } else {
            setStockSymbols([...stockSymbols, stockSymbol]);
        }
    };

    const handleSubmit = async () => {
        selectStock(selectedStocks);
        const url = searchParams.get('url') ?? '/';
        router.push(decodeURIComponent(url));
    };

    return (
        <form action={handleSubmit}>
            <div className='flex flex-wrap gap-[.8rem] md:px-[10.6rem] md:max-h-[calc(38.5rem-10rem)] md:overflow-y-auto'>
                {stocks.map(({ id, name, symbol, logoUrl }) => (
                    <div key={id} className='mb-[.2rem]'>
                        <StockTypeChip
                            label={name}
                            icon={logoUrl ?? ''}
                            onClick={() => toggleStock(symbol)}
                            active={selectedStocks.includes(symbol)}
                        />
                    </div>
                ))}
                <div ref={ref} />
            </div>
            <div className='bottom-0 fixed left-0 right-0 p-8 z-100 bg-white md:static md:max-w-140 md:mx-auto md:pb-0'>
                <Button
                    disabled={selectedStocks.length === 0}
                    type='submit'
                    variant='primary'
                    className='w-full text-[1.6rem] font-bold leading-[140%] rounded-[1.6rem] px-[1.6rem] py-[1.8rem]'
                >
                    {selectedStocks.length}개 선택
                </Button>
            </div>
        </form>
    );
}
