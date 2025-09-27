import { getHotStocks, getSelectedStockSymbols } from '@/features/select-stock/server';
import { SelectStockClientPage } from './SelectStockClientPage';
import { PATH } from '@/shared/config';

export default async function SelectStockPage({ searchParams }: { searchParams: Promise<{ url: string }> }) {
    const { url } = await searchParams;

    // Server Actions 호출
    const nasStocks = await getHotStocks({ count: 30, market: 'NAS' });
    // const nysStocks = await getHotStocks({ count: 15, market: 'NYS' });
    const stocks = [...nasStocks].sort((a, b) => b.price - a.price);
    const selectedStocksResult = await getSelectedStockSymbols();

    // 401 에러가 아닌 경우에만 선택된 주식 목록 사용
    const is401Error = selectedStocksResult.error?.status === 401;
    const mySelectedStockSymbols = !is401Error && selectedStocksResult.success ? selectedStocksResult.data : [];

    return (
        <SelectStockClientPage
            stocks={stocks}
            mySelectedStocks={mySelectedStockSymbols}
            redirectUrl={url ?? PATH.MYPAGE}
        />
    );
}
