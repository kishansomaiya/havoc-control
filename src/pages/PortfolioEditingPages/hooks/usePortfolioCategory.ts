import { useMemo } from 'react';
import {
    CategoryResponse,
    PortfolioResponse,
} from '../../../api/openapi/auto-generated';

export interface UsePortfolioCategoryParams {
    portfolio?: PortfolioResponse;
    isPortfolioLoading: boolean;
    categories: CategoryResponse[];
    isCategoriesLoading: boolean;
}

export function usePortfolioCategory({
    portfolio,
    isPortfolioLoading,
    categories,
    isCategoriesLoading,
}: UsePortfolioCategoryParams) {
    const portfolioCategory = useMemo(() => {
        if (isPortfolioLoading || !portfolio || isCategoriesLoading) {
            return undefined;
        }
        const category = portfolio.category
            ? categories.find((category) => category.id === portfolio.category)
            : undefined;
        const categoryOption = category
            ? { id: category.id, label: category.name }
            : null;
        return categoryOption;
    }, [categories, isCategoriesLoading, isPortfolioLoading, portfolio]);
    return portfolioCategory;
}
