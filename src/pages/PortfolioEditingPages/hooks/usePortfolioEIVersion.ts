import { useMemo } from 'react';
import {
    PortfolioResponse,
    ResultSetResponse,
} from '../../../api/openapi/auto-generated';
import {
    checkIsUserCanAccessEI_3_1_1,
    getPortfolioResultDataVersion,
    getPortfolioResultEIVersion,
} from '../../../utils';
import {
    EIVersion,
    eiVersionFromValue,
    DataVersion,
    getEIToDataVersionMap,
} from '../../../types';
import { useAuth0 } from '@auth0/auth0-react';

export const defaultEIVersion = EIVersion.v3_2_0;

export interface UseEIVersionParams {
    portfolio?: PortfolioResponse;
    resultSets: ResultSetResponse[];
    isResultSetsLoading: boolean;
}

export function usePortfolioEIVersion({
    portfolio,
    resultSets,
    isResultSetsLoading,
}: UseEIVersionParams) {
    const { user } = useAuth0();

    const dataToEIVersionMap = useMemo(
        () => getEIToDataVersionMap(checkIsUserCanAccessEI_3_1_1(user)),
        [user]
    );

    const eiVersion: EIVersion | undefined = useMemo(() => {
        if (isResultSetsLoading) {
            return undefined;
        }
        if (!portfolio) {
            return undefined;
        }
        const eiVersionValue = getPortfolioResultEIVersion({
            ...portfolio,
            resultSets,
        });
        if (eiVersionValue) {
            return eiVersionFromValue(eiVersionValue) ?? defaultEIVersion;
        }

        const dataVersionValue = getPortfolioResultDataVersion({
            ...portfolio,
            resultSets,
        });

        if (!dataVersionValue) {
            return defaultEIVersion;
        }

        return (
            dataToEIVersionMap[dataVersionValue as DataVersion]?.[0] ??
            defaultEIVersion
        );
    }, [isResultSetsLoading, portfolio, resultSets]);
    return eiVersion;
}
