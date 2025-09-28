'use client';

import Button from '@/6_shared/ui/Button/Button';
import { StockList } from './StockList';
import type { Stock } from '@/5_entities/stock';
import { useSelectStock } from '@/4_features/select-stock/hooks';

interface SelectStockClientPageProps {
    stocks: Stock[];
    mySelectedStocks: string[];
    redirectUrl: string;
}

export function SelectStockClientPage({ stocks, mySelectedStocks, redirectUrl }: SelectStockClientPageProps) {
    const { errorMessage, submitSelectedStocks, selectStock, selectedStocks } = useSelectStock({
        selectedStocks: mySelectedStocks,
        redirectUrl,
    });

    return (
        <div>
            <div className='flex flex-wrap gap-[.8rem] md:px-[10.6rem] md:max-h-[calc(38.5rem-10rem)] md:overflow-y-auto'>
                <StockList stocks={stocks} selectedStocks={selectedStocks} onStockToggle={selectStock} />
            </div>
            {errorMessage && <p className='text-red-500 text-center text-[1.6rem] leading-[140%]'>{errorMessage}</p>}
            <div className='bottom-0 fixed left-0 right-0 p-8 z-100 bg-white md:static md:max-w-140 md:mx-auto md:pb-0'>
                <Button
                    disabled={selectedStocks.length === 0}
                    onClick={submitSelectedStocks}
                    variant='primary'
                    className='w-full text-[1.6rem] font-bold leading-[140%] rounded-[1.6rem] px-[1.6rem] py-[1.8rem]'
                >
                    {`${selectedStocks.length}개 선택`}
                </Button>
            </div>
        </div>
    );
}
