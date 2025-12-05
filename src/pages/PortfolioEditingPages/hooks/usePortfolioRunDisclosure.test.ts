import { renderHook } from '@testing-library/react';
import { usePortfolioRunDisclosure } from './usePortfolioRunDisclosure';
import { PortfolioResponse } from '../../../api/openapi/auto-generated';

describe('usePortfolioRunDisclosure', () => {
    it('returns false while loading or missing portfolio', () => {
        const { result: r1 } = renderHook(() =>
            usePortfolioRunDisclosure({
                portfolio: undefined,
                isPortfolioLoading: true,
            })
        );
        expect(r1.current).toBe(false);

        const { result: r2 } = renderHook(() =>
            usePortfolioRunDisclosure({
                portfolio: undefined as unknown as PortfolioResponse,
                isPortfolioLoading: false,
            })
        );
        expect(r2.current).toBe(false);
    });

    it('returns true when disclosure result set id is present', () => {
        const { result } = renderHook(() =>
            usePortfolioRunDisclosure({
                portfolio: {
                    pipelines: [{ disclosureResultSetId: 'x' }],
                } as unknown as PortfolioResponse,
                isPortfolioLoading: false,
            })
        );
        expect(result.current).toBe(true);
    });
});
