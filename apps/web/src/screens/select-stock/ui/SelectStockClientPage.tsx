'use client';

import { useState } from 'react';
import Button from '@/shared/ui/Button';
import { selectStockAction } from '@/features/stock';
import { StockList } from './StockList';
import type { Stock } from '@/entities/stock';

interface SelectStockClientPageProps {
    stocks: Stock[];
    mySelectedStockSymbols: string[];
    redirectUrl: string;
}

export function SelectStockClientPage({ stocks, mySelectedStockSymbols, redirectUrl }: SelectStockClientPageProps) {
    const [selectedStockSymbols, setSelectedStockSymbols] = useState<string[]>([...mySelectedStockSymbols]);

    const handleStockToggle = (symbol: string) => {
        setSelectedStockSymbols(prev => (prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]));
    };

    const handleSubmit = async () => {
        if (selectedStockSymbols.length < 1) {
            alert('최소 1개 이상의 주식을 선택해주세요.');
            return;
        }

        await selectStockAction(selectedStockSymbols, redirectUrl);
    };

    return (
        <div>
            <div className='flex flex-wrap gap-[.8rem] md:px-[10.6rem] md:max-h-[calc(38.5rem-10rem)] md:overflow-y-auto'>
                <StockList stocks={stocks} selectedSymbols={selectedStockSymbols} onStockToggle={handleStockToggle} />
            </div>
            <div className='bottom-0 fixed left-0 right-0 p-8 z-100 bg-white md:static md:max-w-140 md:mx-auto md:pb-0'>
                <Button
                    disabled={selectedStockSymbols.length === 0}
                    onClick={handleSubmit}
                    variant='primary'
                    className='w-full text-[1.6rem] font-bold leading-[140%] rounded-[1.6rem] px-[1.6rem] py-[1.8rem]'
                >
                    {`${selectedStockSymbols.length}개 선택`}
                </Button>
            </div>
        </div>
    );
}
