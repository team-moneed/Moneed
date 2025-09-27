'use client';

import StockTypeChip from './StockChip';
import type { Stock } from '@/entities/stock';

interface StockListProps {
    stocks: Stock[];
    selectedStocks: string[];
    onStockToggle: (symbol: string) => void;
}

export function StockList({ stocks, selectedStocks, onStockToggle }: StockListProps) {
    return (
        <>
            {stocks.map(
                ({ nameKo, symbol, logoUrl }) =>
                    nameKo && (
                        <div key={symbol} className='mb-[.2rem]'>
                            <StockTypeChip
                                label={nameKo}
                                icon={logoUrl ?? ''}
                                onClick={() => onStockToggle(symbol)}
                                active={selectedStocks.includes(symbol)}
                            />
                        </div>
                    ),
            )}
        </>
    );
}
