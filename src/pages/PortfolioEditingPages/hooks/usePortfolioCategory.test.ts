import { renderHook } from '@testing-library/react';
import { usePortfolioCategory } from './usePortfolioCategory';
import {
    CategoryResponse,
    PortfolioResponse,
} from '../../../api/openapi/auto-generated';

describe('usePortfolioCategory', () => {
    it('returns undefined while loading or missing portfolio', () => {
        const { result: r1 } = renderHook(() =>
            usePortfolioCategory({
                portfolio: undefined,
                isPortfolioLoading: true,
                categories: [],
                isCategoriesLoading: false,
            })
        );
        expect(r1.current).toBeUndefined();

        const { result: r2 } = renderHook(() =>
            usePortfolioCategory({
                portfolio: undefined as unknown as PortfolioResponse,
                isPortfolioLoading: false,
                categories: [],
                isCategoriesLoading: false,
            })
        );
        expect(r2.current).toBeUndefined();
    });

    it('maps portfolio.category to option when categories available', () => {
        const { result } = renderHook(() =>
            usePortfolioCategory({
                portfolio: { category: 2 } as unknown as PortfolioResponse,
                isPortfolioLoading: false,
                categories: [
                    { id: 1, name: 'A' },
                    { id: 2, name: 'B' },
                ] as unknown as CategoryResponse[],
                isCategoriesLoading: false,
            })
        );
        expect(result.current).toEqual({ id: 2, label: 'B' });
    });
});
