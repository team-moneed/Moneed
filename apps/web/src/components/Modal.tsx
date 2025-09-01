'use client';

import { ReactNode, useEffect } from 'react';
import Button from '@/components/Button';
import ReactDOM from 'react-dom';

type ModalProps = {
    children: ReactNode;
    leftButtontext?: string;
    rightButtontext?: string;
    leftButtonevent?: () => void;
    rightButtonevent?: () => void;
    leftvisible?: boolean;
    rightvisible?: boolean;
    onClose: () => void;
};

const Modal = ({
    leftButtontext,
    rightButtontext,
    leftButtonevent,
    leftvisible = true,
    rightvisible = true,
    children,
    onClose,
    rightButtonevent,
}: ModalProps) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleOutsideClick = () => {
        onClose();
    };

    const handleInsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return ReactDOM.createPortal(
        <>
            <div
                onClick={handleOutsideClick}
                className='fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50'
            >
                <div
                    onClick={handleInsideClick}
                    className='bg-white w-full max-w-md p-[2.4rem] rounded-[.8rem] shadow-lg relative'
                >
                    <div className='text-[1.4rem] text-center text-moneed-black font-semibold leading-[140%]'>
                        {children}
                    </div>
                    <div className='mt-[2.4rem] flex justify-center gap-[3.9rem]'>
                        {leftvisible && (
                            <Button
                                variant='secondary'
                                className='px-8 py-[1.2rem] text-[1.4rem] font-semibold leading-[140%] border-0 text-moneed-black'
                                onClick={leftButtonevent}
                            >
                                {leftButtontext}
                            </Button>
                        )}
                        {rightvisible && (
                            <Button
                                variant='secondary'
                                className='px-8 py-[1.2rem] text-[1.4rem] font-semibold leading-[140%] border-0 text-moneed-black'
                                onClick={rightButtonevent}
                            >
                                {rightButtontext}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>,
        document.body,
    );
};

export default Modal;
