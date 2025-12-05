import { useMemo } from 'react';
import {
    PortfolioResponse,
} from '../../../api/openapi/auto-generated';

export interface UseDataVersionParams {
    portfolio?: PortfolioResponse;
    isPortfolioLoading: boolean;
}

export function usePortfolioRunDisclosure({
    portfolio,
    isPortfolioLoading,
}: UseDataVersionParams) {
    const runDisclosure = useMemo(() => {
        if (isPortfolioLoading || !portfolio) {
            return false;
        }
        return Boolean(portfolio.pipelines?.[0]?.disclosureResultSetId ?? '');
    }, [isPortfolioLoading, portfolio]);
    return runDisclosure;
}
