import { useCallback, useEffect, useState } from 'react';

// A more generic version that can handle any JSON-serializable type.
export function useSessionStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.sessionStorage.setItem(
                    key,
                    JSON.stringify(valueToStore)
                );
            } catch (error) {
                console.error(error);
            }
        },
        [key, storedValue]
    );

    // This effect is useful if the key changes.
    useEffect(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
            console.error(error);
            setStoredValue(initialValue);
        }
    }, [key, initialValue]);

    return [storedValue, setValue];
}
