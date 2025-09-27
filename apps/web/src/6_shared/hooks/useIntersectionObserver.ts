import { useEffect, useRef } from 'react';

type UseIntersectionObserverProps = {
    onIntersect: () => void;
    options?: IntersectionObserverInit;
};

export const useIntersectionObserver = ({ onIntersect, options }: UseIntersectionObserverProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    onIntersect();
                }
            });
        }, options);

        if (el) {
            observer.observe(el);
        }

        return () => observer.disconnect();
    }, [ref, onIntersect, options]);

    return ref;
};
