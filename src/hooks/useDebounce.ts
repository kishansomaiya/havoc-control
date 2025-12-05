import { useCallback, useEffect, useRef } from 'react';

type TimerHandle = ReturnType<typeof setTimeout>;

export const useDebounce = <T extends unknown[]>(
    callback: (...args: T) => void,
    delay: number
) => {
    const timeoutRef = useRef<TimerHandle | undefined>(undefined);

    const debouncedCallback = useCallback(
        (...args: T) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
};
