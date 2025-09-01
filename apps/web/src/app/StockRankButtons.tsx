import { ChipButton } from '@/components/Chip';
import { BoardRankResponse } from '@/types/board';
const rankMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
};

export default function StockRankButtons({
    stockList,
    selectedStock,
    setSelectedStock,
}: {
    stockList: BoardRankResponse[];
    selectedStock: BoardRankResponse | undefined;
    setSelectedStock: (stock: BoardRankResponse) => void;
}) {
    return (
        <div className='flex gap-4 overflow-x-auto'>
            {stockList.map((stock, index) => {
                return (
                    <ChipButton
                        key={stock.symbol}
                        label={rankMedal(index) + stock.stockName}
                        onClick={() => setSelectedStock(stock)}
                        active={selectedStock?.symbol === stock.symbol}
                    />
                );
            })}
        </div>
    );
}
