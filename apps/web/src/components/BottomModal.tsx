'use client';

import { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/utils/style';

type BottomModalProps = {
    imageSrc?: string;
    title?: ReactNode;
    description?: ReactNode;
    cancleButton?: ReactNode;
    buttons?: ReactNode;
    onClose?: () => void;
    className?: string;
};

const BottomModal = ({ imageSrc, title, description, buttons, onClose, className }: BottomModalProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleOutsideClick = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300);
    };

    const handleInsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return ReactDOM.createPortal(
        <>
            <div
                onClick={handleOutsideClick}
                className={`fixed inset-0 bg-gray-900/50 z-50 flex items-end sm:items-center justify-center transition-opacity duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div
                    onClick={handleInsideClick}
                    className={cn(
                        'bg-white w-200 h-176 px-[2rem] pt-[2.8rem] pb-[2.4rem] rounded-t-[1.6rem] sm:rounded-[1.6rem] shadow-lg transform transition-transform duration-300',
                        isVisible ? 'translate-y-0' : 'translate-y-full',
                        className,
                    )}
                >
                    {imageSrc && (
                        <img src={imageSrc} alt='모달 이미지' className='w-48 aspect-square  mb-[.8rem] mx-auto' />
                    )}

                    {title}
                    {description}

                    <div className='mt-[2.4rem] flex flex-col justify-center items-center w-full gap-[.8rem]'>
                        {buttons}
                    </div>
                </div>
            </div>
        </>,
        document.body,
    );
};

export default BottomModal;
