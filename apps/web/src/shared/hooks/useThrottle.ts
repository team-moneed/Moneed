import { useRef, useCallback } from 'react';

interface UseThrottleOptions {
    delay: number;
}

export function useThrottle<T extends (...args: any[]) => any>(callback: T, options: UseThrottleOptions) {
    const { delay } = options;
    const timeoutRef = useRef<NodeJS.Timeout>();

    const throttledCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay],
    );

    return throttledCallback;
}
