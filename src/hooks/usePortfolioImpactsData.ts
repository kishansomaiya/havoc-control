import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Scenario } from '../types';
import { PerilsOptions, ResultSetType } from '../api/openapi/auto-generated';
import { RESULT_SET_DEFAULT_YEAR_FROM } from '../const';
import { usePortfolioResultSetData } from './usePortfolioResultSetData';

export const usePortfolioImpactsData = () => {
    const {
        portfolioId,
        resultSet: perilsResultSet,
        isResultSetLoading: isPerilResultSetLoading,
        isResultSetError: isPerilResultSetError,
        resultSetOptions,
    } = usePortfolioResultSetData<PerilsOptions>(ResultSetType.perils);

    const {
        resultSet: eiResultSet,
        isResultSetLoading: isEIResultSetLoading,
        isResultSetError: isEIResultSetError,
    } = usePortfolioResultSetData<PerilsOptions>(ResultSetType.damages);

    const {
        resultSet: portfolioFinancialResultSet,
        isResultSetLoading: isPortfolioFinancialResultSetLoading,
        isResultSetError: isPortfolioFinancialResultSetError,
    } = usePortfolioResultSetData<PerilsOptions>(
        ResultSetType.portfolioFinancial
    );

    const [searchParams, setSearchParams] = useSearchParams();

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

    const impactsFiltersFormValuesFromUrlSearchParams = useMemo(() => {
        const yearToParam: string | null = searchParams.get('yearTo');
        const yearTo: '' | number = !yearToParam
            ? ''
            : (parseInt(yearToParam) as number);
        return {
            yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
            yearTo,
            scenario: searchParams.get('scenario') as Scenario,
        };
    }, [searchParams]);

    const yearTo = useMemo(
        () => impactsFiltersFormValuesFromUrlSearchParams?.yearTo,
        [impactsFiltersFormValuesFromUrlSearchParams]
    );

    const yearFrom = useMemo<number>(
        () =>
            impactsFiltersFormValuesFromUrlSearchParams?.yearFrom ||
            RESULT_SET_DEFAULT_YEAR_FROM,
        [impactsFiltersFormValuesFromUrlSearchParams]
    );

    const scenario = useMemo<Scenario | undefined>(
        () =>
            (impactsFiltersFormValuesFromUrlSearchParams?.scenario as Scenario) ||
            undefined,
        [impactsFiltersFormValuesFromUrlSearchParams]
    );

    return {
        impactsFiltersFormValuesFromUrlSearchParams,
        perilsResultSet,
        portfolioFinancialResultSet,
        eiResultSet,
        yearTo,
        yearFrom,
        scenario,
        isResultSetLoading:
            isPerilResultSetLoading ||
            isPortfolioFinancialResultSetLoading ||
            isEIResultSetLoading,
        portfolioId,
        resultSetOptions,
        handleFiltersChange,
        isResultSetError:
            isPerilResultSetError ||
            isPortfolioFinancialResultSetError ||
            isEIResultSetError,
    };
};
