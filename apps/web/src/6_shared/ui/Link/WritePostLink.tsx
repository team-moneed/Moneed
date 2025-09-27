'use client';
import { PATH } from '@/6_shared/config';
import ButtonLink from './ButtonLink';
import { cn } from '@/6_shared/utils/style';

export default function WritePostLink() {
    return (
        <ButtonLink
            href={PATH.WRITEPOST}
            className={cn('gap-4 px-[2.4rem] py-[.8rem] items-center hidden sm:flex')}
            variant='brand'
        >
            <img className='w-[1.8rem] h-[1.8rem]' src='/icon/icon-edit.svg' alt='글쓰기' />
            <span className='font-semibold leading-[135%] text-[1.4rem]'>포스팅</span>
        </ButtonLink>
    );
}
