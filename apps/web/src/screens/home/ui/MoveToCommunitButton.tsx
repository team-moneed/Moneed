'use client';
import { DYNAMIC_PATH } from '@/shared/config';
import Button from '@/shared/ui/Button';
import { CommunityDTO } from '@/features/community/model';
import { useRouter } from 'next/navigation';

export default function MoveToCommunityButton({ selectedStock }: { selectedStock: CommunityDTO }) {
    const router = useRouter();
    const movecommunity = (symbol: string) => {
        router.push(DYNAMIC_PATH.COMMUNITY_SYMBOL(symbol));
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
