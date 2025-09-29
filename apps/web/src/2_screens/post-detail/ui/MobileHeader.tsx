'use client';
import { useModal } from '@/6_shared/hooks/useModal';
import { useCommentStore } from '@/6_shared/store/useCommentStore';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import CancelWriteModalContent from '@/4_features/post/ui/CancelWriteModalContent';

export const MobileHeader = ({ stockName }: { stockName: string }) => {
    const router = useRouter();
    const { openModal } = useModal();
    const { isEditingComment } = useCommentStore(
        useShallow(state => ({
            isEditingComment: state.isEditingComment,
        })),
    );

    const handleBack = () => {
        if (isEditingComment) {
            openModal(<CancelWriteModalContent type='edit' />);
        } else {
            router.back();
        }
    };

    const handleExit = () => {
        if (isEditingComment) {
            openModal(<CancelWriteModalContent type='edit' />);
        } else {
            router.back();
        }
    };

    return (
        <header className='sticky top-0 z-10 bg-white flex items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem] lg:hidden'>
            <button onClick={handleBack}>
                <img className='cursor-pointer w-[2.4rem] h-[2.4rem]' src='/icon/icon-arrow-back.svg' alt='뒤로 가기' />
            </button>
            <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>
                {isEditingComment ? '댓글 수정' : stockName || ''}
            </h1>
            <button onClick={handleExit}>
                <img className='cursor-pointer w-[2.4rem] h-[2.4rem]' src='/icon/icon-exit.svg' alt='나가기' />
            </button>
        </header>
    );
};
