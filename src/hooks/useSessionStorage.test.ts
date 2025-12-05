import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSessionStorage } from './useSessionStorage';

describe('useSessionStorage', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    afterEach(() => {
        sessionStorage.clear();
        vi.restoreAllMocks();
    });

    it('should initialize with the provided initialValue when sessionStorage is empty', () => {
        const TEST_KEY = 'my-key';
        const INITIAL_VALUE = 'hello world';
        const { result } = renderHook(() =>
            useSessionStorage(TEST_KEY, INITIAL_VALUE)
        );

        expect(result.current[0]).toBe(INITIAL_VALUE);
        expect(sessionStorage.getItem(TEST_KEY)).toBe(null);
    });

    it('should initialize with the value from sessionStorage, ignoring initialValue', () => {
        const TEST_KEY = 'my-key';
        const SESSION_VALUE = { a: 1 };
        const INITIAL_VALUE = { b: 2 };

        sessionStorage.setItem(TEST_KEY, JSON.stringify(SESSION_VALUE));

        const { result } = renderHook(() =>
            useSessionStorage(TEST_KEY, INITIAL_VALUE)
        );

        expect(result.current[0]).toEqual(SESSION_VALUE);
    });

    it('should update state and sessionStorage when setValue is called with a new value', () => {
        const TEST_KEY = 'my-key';
        const INITIAL_VALUE = { count: 0 };
        const UPDATED_VALUE = { count: 1 };

        const { result } = renderHook(() =>
            useSessionStorage(TEST_KEY, INITIAL_VALUE)
        );

        act(() => {
            const setValue = result.current[1];
            setValue(UPDATED_VALUE);
        });

        expect(result.current[0]).toEqual(UPDATED_VALUE);
        expect(sessionStorage.getItem(TEST_KEY)).toBe(
            JSON.stringify(UPDATED_VALUE)
        );
    });

    it('should update state and sessionStorage when setValue is called with a function', () => {
        const TEST_KEY = 'my-key';
        const INITIAL_VALUE = 10;

        const { result } = renderHook(() =>
            useSessionStorage(TEST_KEY, INITIAL_VALUE)
        );

        act(() => {
            const setValue = result.current[1];
            setValue((prev) => prev + 5);
        });

        expect(result.current[0]).toBe(15);
        expect(sessionStorage.getItem(TEST_KEY)).toBe(JSON.stringify(15));
    });

    it('should update its value when the key changes', () => {
        const key1 = 'first-key';
        const value1 = { name: 'first' };
        const key2 = 'second-key';
        const value2 = { name: 'second' };

        sessionStorage.setItem(key1, JSON.stringify(value1));
        sessionStorage.setItem(key2, JSON.stringify(value2));

        const { result, rerender } = renderHook(
            ({ key, initialValue }) => useSessionStorage(key, initialValue),
            { initialProps: { key: key1, initialValue: {} } }
        );

        expect(result.current[0]).toEqual(value1);
        rerender({ key: key2, initialValue: {} });
        expect(result.current[0]).toEqual(value2);
    });

    it('should use initialValue if sessionStorage contains invalid JSON', () => {
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const TEST_KEY = 'my-key';
        const INITIAL_VALUE = { status: 'default' };
        const INVALID_JSON = '{ "a": 1, '; // Malformed JSON

        sessionStorage.setItem(TEST_KEY, INVALID_JSON);

        const { result } = renderHook(() =>
            useSessionStorage(TEST_KEY, INITIAL_VALUE)
        );

        expect(result.current[0]).toEqual(INITIAL_VALUE);
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should switch to initialValue when key changes to one not in sessionStorage', () => {
        const key1 = 'key-with-value';
        const value1 = 'i exist';
        const key2 = 'key-without-value';
        const initialValue2 = 'i am default';

        sessionStorage.setItem(key1, JSON.stringify(value1));

        const { result, rerender } = renderHook(
            ({ key, initialValue }) => useSessionStorage(key, initialValue),
            { initialProps: { key: key1, initialValue: 'initial1' } }
        );

        expect(result.current[0]).toBe(value1);

        rerender({ key: key2, initialValue: initialValue2 });

        expect(result.current[0]).toBe(initialValue2);
    });
});
