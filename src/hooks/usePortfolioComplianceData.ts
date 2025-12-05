import { usePortfolioResultSetData } from './usePortfolioResultSetData';
import {
    DisclosureCategory,
    DisclosureResultSetOptionsOutput,
    ResultSetType,
} from '../api/openapi/auto-generated';
import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { ALL_CLIMATE_RELATED_CATEGORY_VALUE } from '../const';
import { Scenario } from '../types';
import { useResultSetMetadataQuery } from '../api/queries/resultSetsQuery';

export const usePortfolioComplianceData = () => {
    const {
        resultSet,
        isResultSetLoading,
        isResultSetError,
        resultSetOptions,
    } = usePortfolioResultSetData<DisclosureResultSetOptionsOutput>(
        ResultSetType.disclosure
    );

    const {
        resultSetMetadata,
        isResultSetMetadataLoading,
        isResultSetMetadataError,
    } = useResultSetMetadataQuery({ resultSetId: resultSet?.id });

    const isLoading = useMemo(
        () => isResultSetLoading || isResultSetMetadataLoading,
        [isResultSetLoading, isResultSetMetadataLoading]
    );

    const hasLoadingError = useMemo(
        () => isResultSetError || isResultSetMetadataError,
        [isResultSetError, isResultSetMetadataError]
    );

    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategory:
        | DisclosureCategory
        | typeof ALL_CLIMATE_RELATED_CATEGORY_VALUE =
        (searchParams.get('category') as
            | DisclosureCategory
            | typeof ALL_CLIMATE_RELATED_CATEGORY_VALUE) ||
        ALL_CLIMATE_RELATED_CATEGORY_VALUE;

    const handleFiltersChange = useCallback(
        (filterFormValues: { [key: string]: string | number }) => {
            const params = new URLSearchParams();

            Object.keys(filterFormValues).forEach((key) => {
                params.append(key, (filterFormValues[key] || '').toString());
            });

            if (searchParams.toString() === params.toString()) {
                return;
            }

            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const filterFormValues = useMemo(() => {
        const years = (searchParams.get('years') || '')
            .split(',')
            .map((year) => Number(year));
        return {
            category: selectedCategory,
            scenario: searchParams.get('scenario') as Scenario | '',
            years,
        };
    }, [searchParams, selectedCategory]);

    return {
        complianceResultSet: resultSet,
        resultSetMetadata,
        isLoading,
        hasLoadingError,
        resultSetOptions,
        handleFiltersChange,
        selectedCategory,
        filterFormValues,
    };
};
