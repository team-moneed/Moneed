'use client';
import { ModalContext, useModal } from '@/6_shared/hooks/useModal';
import { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode | null>(null);

    const openModal = (content: ReactNode) => {
        setContent(content);
        setIsOpen(true);
    };

    const closeModal = () => {
        setContent(null);
        setIsOpen(false);
    };

    return (
        <ModalContext value={{ isOpen, content, openModal, closeModal }}>
            {children}
            {isOpen && <Modal />}
        </ModalContext>
    );
}

function Modal() {
    const { content, closeModal } = useModal();

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <>
            {createPortal(
                <div
                    className='fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50'
                    onClick={handleBackdropClick}
                >
                    {content}
                </div>,
                document.body,
            )}
        </>
    );
}
