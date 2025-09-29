import { useState } from 'react';
import { selectStockAction } from '../server';

export const useSelectStock = ({ selectedStocks, redirectUrl }: { selectedStocks: string[]; redirectUrl: string }) => {
    const [selectedStocksState, setSelectedStocks] = useState<string[]>([...selectedStocks]);
    const [errorMessage, setErrorMessage] = useState('');
    const selectStock = (symbol: string) => {
        setSelectedStocks(prev => (prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]));
    };

    const submitSelectedStocks = async () => {
        if (selectedStocksState.length < 1) {
            alert('최소 1개 이상의 주식을 선택해주세요.');
            return;
        }

        const result = await selectStockAction(selectedStocksState, redirectUrl);
        if (result?.message) {
            setErrorMessage(result.message);
        }
    };

    return { selectStock, submitSelectedStocks, errorMessage, selectedStocks: selectedStocksState };
};
