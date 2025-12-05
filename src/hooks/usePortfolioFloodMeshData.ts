import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Scenario } from '../types';
import {
    MeshOptions,
    ResultSetDataSchema,
    ResultSetType,
} from '../api/openapi/auto-generated';
import { useResultSetSchemaQuery } from '../api/queries/resultSetsQuery';
import { RESULT_SET_DEFAULT_YEAR_FROM } from '../const';
import { usePortfolioResultSetData } from './usePortfolioResultSetData';

export const usePortfolioFloodMeshData = () => {
    const {
        portfolioId,
        resultSet: floodMeshResultSet,
        isResultSetLoading,
        isResultSetError,
        resultSetOptions,
    } = usePortfolioResultSetData<MeshOptions>(ResultSetType.mesh);

    const [searchParams, setSearchParams] = useSearchParams();

    const {
        resultSetSchema,
        isResultSetSchemaLoading,
        isResultSetSchemaError,
    } = useResultSetSchemaQuery({
        resultSetId: floodMeshResultSet?.id,
    });

    const handleFiltersChange = useCallback(
        (filterFormValues: { [key: string]: string | number }) => {
            const params = new URLSearchParams();
            Object.keys(filterFormValues).forEach((key) => {
                params.append(key, filterFormValues[key].toString());
            });

            if (searchParams.toString() === params.toString()) {
                return;
            }

            setSearchParams(params, { replace: true });
        },
        [setSearchParams, searchParams]
    );

    const floodMeshFiltersFormValuesFromUrlSearchParams = useMemo(() => {
        const yearToParam: string | null = searchParams.get('yearTo');
        const yearTo: '' | number = !yearToParam
            ? ''
            : (parseInt(yearToParam) as number);
        return {
            metric: searchParams.get('metric') || '',
            yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
            yearTo,
            scenario: searchParams.get('scenario') as Scenario | '',
        };
    }, [searchParams]);

    const selectedMetric = useMemo<ResultSetDataSchema | undefined>(() => {
        return (resultSetSchema || []).find((option) => {
            return option.id === searchParams.get('metric');
        });
    }, [resultSetSchema, searchParams]);

    const yearTo = useMemo(() => {
        return floodMeshFiltersFormValuesFromUrlSearchParams?.yearTo;
    }, [floodMeshFiltersFormValuesFromUrlSearchParams]);

    const yearFrom = useMemo<number>(() => {
        return (
            floodMeshFiltersFormValuesFromUrlSearchParams?.yearFrom ||
            RESULT_SET_DEFAULT_YEAR_FROM
        );
    }, [floodMeshFiltersFormValuesFromUrlSearchParams]);

    return {
        floodMeshFiltersFormValuesFromUrlSearchParams,
        floodMeshResultSet,
        yearTo,
        yearFrom,
        isResultSetSchemaLoading,
        isResultSetLoading,
        resultSetSchema,
        portfolioId,
        resultSetOptions,
        handleFiltersChange,
        selectedMetric,
        isResultSetError,
        isResultSetSchemaError,
    };
};
