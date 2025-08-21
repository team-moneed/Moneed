'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Modal from '@/components/Modal';

//수정필요~!

interface ModalContextType {
    modal: <T extends boolean>(props: ModalProps) => Promise<T>;
    confirm: (message: string | ReactNode, options?: ConfirmOptions) => Promise<boolean>;
    alert?: (message: string | ReactNode, options?: AlertOptions) => Promise<void>;
}

interface ModalProps {
    children: ReactNode;
    leftButtontext?: string;
    rightButtontext: string;
    leftvisible?: boolean;
    rightvisible?: boolean;
    leftButtonevent?: () => void;
    rightButtonevent?: () => void;
    onClose?: () => void; // 추가: Modal에서 닫기 이벤트 처리
}

interface ConfirmOptions {
    leftButtontext?: string;
    rightButtontext?: string;
}

interface AlertOptions {
    buttonText?: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalProps, setModalProps] = useState<ModalProps | null>(null);
    const [resolveCallback, setResolveCallback] = useState<((param: boolean) => void) | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const closeModal = () => {
        setModalProps(null);
        setShowModal(false);
        if (resolveCallback) {
            resolveCallback(false);
            setResolveCallback(null);
        }
    };

    const modal = <T extends boolean>(props: ModalProps): Promise<T> => {
        return new Promise(resolve => {
            setResolveCallback(() => resolve);
            setModalProps({
                ...props,
                leftButtonevent: () => {
                    resolve(false as T);
                    closeModal();
                },
                rightButtonevent: () => {
                    resolve(true as T);
                    closeModal();
                },
            });
            setShowModal(true);
        });
    };

    const confirm = (message: string | ReactNode, options: ConfirmOptions = {}) => {
        return modal<boolean>({
            children: message,
            leftButtontext: options.leftButtontext || '취소',
            rightButtontext: options.rightButtontext || '확인',
            leftvisible: true,
            rightvisible: true,
            onClose: closeModal,
        });
    };

    return (
        <ModalContext.Provider value={{ modal, confirm }}>
            {children}
            {showModal && modalProps && <Modal {...modalProps} onClose={closeModal} />}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};
