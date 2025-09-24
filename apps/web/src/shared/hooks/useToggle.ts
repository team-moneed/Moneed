import { useState } from 'react';

export const useToggle = ({ onToggle }: { onToggle?: () => void } = {}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
        onToggle?.();
    };

    return { isOpen, toggle };
};
