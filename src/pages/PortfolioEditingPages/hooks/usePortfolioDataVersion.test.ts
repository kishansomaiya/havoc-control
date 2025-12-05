import { renderHook } from '@testing-library/react';
import {
    usePortfolioDataVersion,
    defaultDataVersion,
} from './usePortfolioDataVersion';
import {
    PortfolioResponse,
    ResultSetResponse,
} from '../../../api/openapi/auto-generated';

describe('usePortfolioDataVersion', () => {
    it('returns undefined while loading or when portfolio missing', () => {
        const { result: r1 } = renderHook(() =>
            usePortfolioDataVersion({
                portfolio: undefined,
                resultSets: [],
                isResultSetsLoading: true,
            })
        );
        expect(r1.current).toBeUndefined();

        const { result: r2 } = renderHook(() =>
            usePortfolioDataVersion({
                portfolio: undefined as unknown as PortfolioResponse,
                resultSets: [],
                isResultSetsLoading: false,
            })
        );
        expect(r2.current).toBeUndefined();
    });

    it('falls back to default when no dataVersion present or invalid', () => {
        const { result } = renderHook(() =>
            usePortfolioDataVersion({
                portfolio: { id: 1 } as unknown as PortfolioResponse,
                resultSets: [] as unknown as ResultSetResponse[],
                isResultSetsLoading: false,
            })
        );
        expect(result.current).toBe(defaultDataVersion);
    });
});
