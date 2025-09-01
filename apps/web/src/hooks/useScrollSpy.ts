'use client';

import { useEffect, useRef, useState } from 'react';

const useScrollSpy = (options: IntersectionObserverInit) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

    useEffect(() => {
        const element = elementRef.current;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                setIsIntersecting(entry.isIntersecting);
            });
        }, options);

        // 요소를 관찰
        if (element) {
            observer.observe(element);
        }

        // 클린업
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [options]);

    return { elementRef, isIntersecting };
};

export default useScrollSpy;
