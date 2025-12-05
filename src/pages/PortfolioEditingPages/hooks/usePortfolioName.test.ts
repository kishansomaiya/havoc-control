import { renderHook } from '@testing-library/react';
import { usePortfolioName } from './usePortfolioName';
import { PortfolioResponse } from '../../../api/openapi/auto-generated';

describe('usePortfolioName', () => {
    it('returns undefined when loading or portfolio missing', () => {
        const { result: r1 } = renderHook(() =>
            usePortfolioName({ portfolio: undefined, isPortfolioLoading: true })
        );
        expect(r1.current).toBeUndefined();

        const { result: r2 } = renderHook(() =>
            usePortfolioName({
                portfolio: undefined as unknown as PortfolioResponse,
                isPortfolioLoading: false,
            })
        );
        expect(r2.current).toBeUndefined();
    });

    it('returns name or empty string', () => {
        const { result: r1 } = renderHook(() =>
            usePortfolioName({
                portfolio: { name: 'Test' } as PortfolioResponse,
                isPortfolioLoading: false,
            })
        );
        expect(r1.current).toBe('Test');

        const { result: r2 } = renderHook(() =>
            usePortfolioName({
                portfolio: { name: undefined } as unknown as PortfolioResponse,
                isPortfolioLoading: false,
            })
        );
        expect(r2.current).toBe('');
    });
});
