'use client';

import { useModal } from '@/6_shared/hooks/useModal';
import CancelWriteModalContent from '@/4_features/post/ui/CancelWriteModalContent';
import Image from 'next/image';
import iconArrowBack from '/public/icon/icon-arrow-back.svg';
import iconExit from '/public/icon/icon-exit.svg';

export default function EditPostLayout({ children }: { children: React.ReactNode }) {
    const { openModal } = useModal();

    return (
        <>
            <header className='sticky top-0 z-10 bg-white flex items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem]'>
                <button onClick={() => openModal(<CancelWriteModalContent type='edit' />)}>
                    <Image className='cursor-pointer w-[2.4rem] h-[2.4rem]' src={iconArrowBack} alt='뒤로 가기' />
                </button>
                <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>게시글 수정</h1>
                <button onClick={() => openModal(<CancelWriteModalContent type='edit' />)}>
                    <Image className='cursor-pointer w-[2.4rem] h-[2.4rem]' src={iconExit} alt='나가기' />
                </button>
            </header>
            <main className='flex-1'>{children}</main>
        </>
    );
}
