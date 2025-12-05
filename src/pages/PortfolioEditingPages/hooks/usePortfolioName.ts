import { useMemo } from 'react';
import { PortfolioResponse } from '../../../api/openapi/auto-generated';

export interface UsePortfolioNameParams {
    portfolio?: PortfolioResponse;
    isPortfolioLoading: boolean;
}

export function usePortfolioName({
    portfolio,
    isPortfolioLoading,
}: UsePortfolioNameParams) {
    const portfolioName = useMemo(() => {
        if (isPortfolioLoading || !portfolio) {
            return undefined;
        }
        return portfolio.name ?? '';
    }, [isPortfolioLoading, portfolio]);
    return portfolioName;
}
