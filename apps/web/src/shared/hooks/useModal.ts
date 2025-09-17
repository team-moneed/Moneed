import { createContext, ReactNode, useContext } from 'react';
import { ERROR_MSG } from '../config';

interface ModalContextType {
    content: ReactNode | null;
    isOpen: boolean;
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw Error(ERROR_MSG.MODAL_CONTEXT_NOT_FOUND);
    }
    return context;
};
