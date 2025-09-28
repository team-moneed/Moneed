'use client';
import { PATH } from '@/6_shared/config';
import ButtonLink from './ButtonLink';

export default function MobileWritePostLink() {
    return (
        <ButtonLink
            href={PATH.WRITEPOST}
            className='aspect-square w-[5.2rem] bg-moneed-brand absolute bottom-[calc(100%+2rem)] flex items-center justify-center rounded-full right-8'
        >
            <img src='/icon/icon-edit.svg' alt='게시글 작성' />
        </ButtonLink>
    );
}
