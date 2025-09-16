import { DYNAMIC_PATH } from '@/shared/config';
import { CommunityDTO } from '@/features/community/model';
import ButtonLink from '@/shared/ui/Link/ButtonLink';

export default function MoveToCommunityButton({ selectedStock }: { selectedStock: CommunityDTO }) {
    return (
        <ButtonLink
            variant='secondary'
            href={DYNAMIC_PATH.COMMUNITY_SYMBOL(selectedStock.symbol)}
            className='flex sm:w-fit w-full items-center justify-center gap-[.8rem] py-[2.1rem] px-[4.1rem]'
        >
            <span className='text-[1.4rem] text-moneed-gray-8 font-semibold leading-[135%]'>
                {selectedStock.stockName} 게시판 더보기
            </span>
        </ButtonLink>
    );
}
