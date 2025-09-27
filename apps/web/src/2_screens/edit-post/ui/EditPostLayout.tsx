'use client';

import { useModal } from '@/6_shared/hooks/useModal';
import CancelWriteModalContent from '@/4_features/post/ui/CancelWriteModalContent';

export default function EditPostLayout({ children }: { children: React.ReactNode }) {
    const { openModal } = useModal();

    return (
        <>
            <header className='sticky top-0 z-10 bg-white flex items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem]'>
                <button onClick={() => openModal(<CancelWriteModalContent type='edit' />)}>
                    <img
                        className='cursor-pointer w-[2.4rem] h-[2.4rem]'
                        src='/icon/icon-arrow-back.svg'
                        alt='뒤로 가기'
                    />
                </button>
                <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>게시글 수정</h1>
                <button onClick={() => openModal(<CancelWriteModalContent type='edit' />)}>
                    <img className='cursor-pointer w-[2.4rem] h-[2.4rem]' src='/icon/icon-exit.svg' alt='나가기' />
                </button>
            </header>
            <main className='flex-1'>{children}</main>
        </>
    );
}
