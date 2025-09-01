import { RefObject } from 'react';

function useMoveScroll(ref: RefObject<HTMLDivElement>) {
    const headerOffset = 70;
    const elementPositionTop = ref.current?.getBoundingClientRect().top;
    const onMoveToElement = () => {
        const offsetPosition = (elementPositionTop || 0) + window.scrollY - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    };

    return { onMoveToElement };
}

export default useMoveScroll;
