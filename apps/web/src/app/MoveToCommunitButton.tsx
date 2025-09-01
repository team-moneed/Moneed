'use client';
import Button from '@/components/Button';
import { BoardRankResponse } from '@/types/board';
import { useRouter } from 'next/navigation';

export default function MoveToCommunityButton({ selectedStock }: { selectedStock: BoardRankResponse }) {
    const router = useRouter();
    const movecommunity = (symbol: string) => {
        router.push(`/community/${symbol}`);
    };

    return (
        <Button
            variant='secondary'
            onClick={() => movecommunity(selectedStock.symbol)}
            className='flex items-center gap-[.8rem] py-[2.1rem] px-[4.1rem]'
        >
            <span className='text-[1.4rem] text-moneed-gray-8 font-semibold leading-[135%]'>
                {selectedStock.stockName} 게시판 더보기
            </span>
        </Button>
    );
}
