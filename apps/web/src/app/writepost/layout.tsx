'use client';
import { Suspense } from 'react';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WritePostLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const handleModalConfirm = () => {
        setShowModal(false);
        router.back(); // 모달에서 나가기를 클릭 시 뒤로가기
    };

    const handleModalCancel = () => {
        setShowModal(false); // 모달에서 이어서 하기 클릭 시 모달 닫기
    };

    const ExitButton = () => {
        return (
            <img
                className='w-[2.4rem] h-[2.4rem] cursor-pointer'
                onClick={() => setShowModal(true)}
                src='/icon/icon-exit.svg'
                alt='exit'
            />
        );
    };

    const BackButton = () => {
        return (
            <img
                className='cursor-pointer w-[2.4rem] h-[2.4rem]'
                onClick={() => setShowModal(true)}
                src='/icon/icon-arrow-back.svg'
                alt='back'
            />
        );
    };

    return (
        <>
            <header className='sticky top-0 z-10 bg-white flex items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem]'>
                <BackButton />
                <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>게시판 글쓰기</h1>
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
                            작성하던 글은 저장되지않아요.
                            <br />
                            다음에 작성할까요?
                        </span>
                    </Modal>
                )}
            </header>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </>
    );
}
