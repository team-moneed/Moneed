'use client';
import Modal from '@/shared/ui/Modal';
import { useCommentStore } from '@/shared/store/useCommentStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const MobileHeader = ({ stockName }: { stockName: string }) => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const { isEditingComment } = useCommentStore(
        useShallow(state => ({
            isEditingComment: state.isEditingComment,
        })),
    );

    const handleModalConfirm = () => {
        setShowModal(false);
        router.back();
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    const ExitButton = () => {
        const handleClick = isEditingComment ? () => setShowModal(true) : () => router.back();
        return (
            <img
                className='w-[2.4rem] h-[2.4rem] cursor-pointer'
                onClick={handleClick}
                src='/icon/icon-exit.svg'
                alt='exit'
            />
        );
    };

    const BackButton = () => {
        const handleClick = isEditingComment ? () => setShowModal(true) : () => router.back();
        return (
            <img
                className='cursor-pointer w-[2.4rem] h-[2.4rem]'
                onClick={handleClick}
                src='/icon/icon-arrow-back.svg'
                alt='back'
            />
        );
    };

    return (
        <header className='sticky top-0 z-10 bg-white flex items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem] lg:hidden'>
            <BackButton />
            <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>
                {isEditingComment ? '댓글 수정' : stockName || ''}
            </h1>
            <ExitButton />
            {showModal && (
                <Modal
                    leftButtontext='이어서 하기'
                    rightButtontext='나가기'
                    leftButtonevent={handleModalCancel}
                    rightButtonevent={handleModalConfirm}
                    onClose={handleModalCancel}
                >
                    <span>
                        수정하던 내용은 저장되지않아요.
                        <br />
                        다음에 수정할까요?
                    </span>
                </Modal>
            )}
        </header>
    );
};
