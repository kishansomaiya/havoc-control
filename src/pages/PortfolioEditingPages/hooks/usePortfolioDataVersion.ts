import { useMemo } from 'react';
import {
    PortfolioResponse,
    ResultSetResponse,
} from '../../../api/openapi/auto-generated';
import { getPortfolioResultDataVersion } from '../../../utils';
import { DataVersion, dataVersionFromValue } from '../../../types';

export const defaultDataVersion = DataVersion.v3_2_0;

export interface UseDataVersionParams {
    portfolio?: PortfolioResponse;
    resultSets: ResultSetResponse[];
    isResultSetsLoading: boolean;
}

export function usePortfolioDataVersion({
    portfolio,
    resultSets,
    isResultSetsLoading,
}: UseDataVersionParams) {
    const dataVersion: DataVersion | undefined = useMemo(() => {
        if (isResultSetsLoading) {
            return undefined;
        }
        if (!portfolio) {
            return undefined;
        }
        const dataVersionValue = getPortfolioResultDataVersion({
            ...portfolio,
            resultSets,
        });
        if (!dataVersionValue) {
            return defaultDataVersion;
        }
        const dataVersion = dataVersionFromValue(dataVersionValue);
        if (!dataVersion) {
            return defaultDataVersion;
        }
        return dataVersion;
    }, [isResultSetsLoading, portfolio, resultSets]);
    return dataVersion;
}
