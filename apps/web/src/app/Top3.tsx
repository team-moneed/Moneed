'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getBoardRank } from '@/apis/board.api';
import { BoardRankResponse } from '@/types/board';
import MoveToCommunityButton from './MoveToCommunitButton';
import { StockRankButtonsSkeleton } from '@/components/Skeletons/StockRankButtonSkeleton';
import StockRankButtons from './StockRankButtons';
import { Top3PostsSkeleton } from '@/components/Skeletons/Top3PostSkeleton';
import Top3Posts from './Top3Posts';
import withSuspense from '@/components/HOC/withSuspense';

// TODO: 1시간마다 서버에서 업데이트 해야함
const Top3 = () => {
    const anHour = 1000 * 60 * 60;
    const { data: stockList } = useSuspenseQuery({
        queryKey: ['board-rank-top3'],
        queryFn: () => getBoardRank({ limit: 3 }),
        staleTime: anHour,
    });

    const [selectedStock, setSelectedStock] = useState<BoardRankResponse>(stockList[0]);

    if (stockList.length === 0 || !stockList) {
        return <div className='text-4xl text-center text-moneed-gray-8'>게시글이 존재하지 않습니다</div>;
    }

    return (
        <>
            <StockRankButtons
                stockList={stockList ?? []}
                selectedStock={selectedStock}
                setSelectedStock={setSelectedStock}
            />
            <Top3Posts selectedStock={selectedStock} />
            <MoveToCommunityButton selectedStock={selectedStock} />
        </>
    );
};

export default withSuspense(
    Top3,
    <>
        <StockRankButtonsSkeleton count={3} />
        <Top3PostsSkeleton count={3} />
    </>,
);
