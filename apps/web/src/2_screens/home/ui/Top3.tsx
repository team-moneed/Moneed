'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getBoardRank } from '@/4_features/community/api/board.api';
import { CommunityDTO } from '@/4_features/community/model';
import MoveToCommunityButton from './MoveToCommunitButton';
import { StockRankButtonsSkeleton } from '@/6_shared/ui/Skeletons/StockRankButtonSkeleton';
import StockRankButtons from './StockRankButtons';
import { Top3PostsSkeleton } from '@/6_shared/ui/Skeletons/Top3PostSkeleton';
import Top3Posts from './Top3Posts';
import withSuspense from '@/6_shared/ui/withSuspense';

// TODO: 1시간마다 서버에서 업데이트 해야함
const Top3 = () => {
    const anHour = 1000 * 60 * 60;
    const { data: stockList } = useSuspenseQuery({
        queryKey: ['board-rank-top3'],
        queryFn: () => getBoardRank({ limit: 3 }),
        staleTime: anHour,
    });

    const [selectedStock, setSelectedStock] = useState<CommunityDTO>(stockList[0]);

    if (stockList.length === 0 || !stockList) {
        return <div className='text-4xl text-center text-moneed-gray-8'>게시글이 존재하지 않습니다</div>;
    }

    return (
        <div className='flex flex-col gap-[1.2rem]'>
            <StockRankButtons
                stockList={stockList ?? []}
                selectedStock={selectedStock}
                setSelectedStock={setSelectedStock}
            />
            <Top3Posts selectedStock={selectedStock} />
            <MoveToCommunityButton selectedStock={selectedStock} />
        </div>
    );
};

export default withSuspense(
    Top3,
    <>
        <StockRankButtonsSkeleton count={3} />
        <Top3PostsSkeleton count={3} />
    </>,
);
