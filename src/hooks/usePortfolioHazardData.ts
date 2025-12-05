import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataVersion, Scenario, Score } from '../types';
import {
    PerilsOptions,
    PerilsOptionsPerilsEnum,
    ResultSetDataSchema,
    ResultSetType,
} from '../api/openapi/auto-generated';
import { useResultSetSchemaQuery } from '../api/queries/resultSetsQuery';
import { RESULT_SET_DEFAULT_YEAR_FROM } from '../const';
import { usePortfolioResultSetData } from './usePortfolioResultSetData';

const BASE_HAZARD_SCORES = [
    Score.Flood,
    Score.Wind,
    Score.Fire,
    Score.Heat,
    Score.Precipitation,
    Score.Cold,
    Score.Drought,
    Score.Hail,
];

export const usePortfolioHazardData = () => {
    const {
        portfolioId,
        resultSet: perilsResultSet,
        isResultSetLoading,
        isResultSetError,
        resultSetOptions,
    } = usePortfolioResultSetData<PerilsOptions>(ResultSetType.perils);

    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedScore, setSelectedScore] = useState<Score>(
        (searchParams.get('peril') as Score) || BASE_HAZARD_SCORES[0]
    );

    const {
        resultSetSchema,
        isResultSetSchemaLoading,
        isResultSetSchemaError,
    } = useResultSetSchemaQuery({
        resultSetId: perilsResultSet?.id,
    });

    const HAZARD_SCORES = useMemo<Score[]>(() => {
        const includeSubsidence =
            String(resultSetOptions?.dataVersion) === DataVersion.v3_3_0;
        return includeSubsidence
            ? [
                  ...BASE_HAZARD_SCORES.slice(0, 7),
                  Score.Subsidence,
                  ...BASE_HAZARD_SCORES.slice(7),
              ]
            : BASE_HAZARD_SCORES;
    }, [resultSetOptions]);

    const disabledScores = useMemo(() => {
        return HAZARD_SCORES.filter((score) => {
            return !resultSetOptions?.perils?.includes(
                score as PerilsOptionsPerilsEnum
            );
        });
    }, [resultSetOptions, HAZARD_SCORES]);

    useEffect(() => {
        if (!resultSetOptions) {
            return;
        }
        const enabledScores = HAZARD_SCORES.filter((score) => {
            return resultSetOptions?.perils?.includes(
                score as PerilsOptionsPerilsEnum
            );
        });

        if (enabledScores.includes(selectedScore)) {
            return;
        }

        setSelectedScore(enabledScores[0]);
    }, [resultSetOptions, selectedScore, HAZARD_SCORES]);

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

    const hazardFiltersFormValuesFromUrlSearchParams = useMemo(() => {
        const yearToParam: string | null = searchParams.get('yearTo');
        const yearTo: '' | number = !yearToParam
            ? ''
            : (parseInt(yearToParam) as number);
        return {
            metric: searchParams.get('metric') || '',
            yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
            yearTo,
            scenario: searchParams.get('scenario') as Scenario,
            peril: searchParams.get('peril') as Score,
        };
    }, [searchParams]);

    const selectedMetric = useMemo<ResultSetDataSchema | undefined>(() => {
        return (resultSetSchema || []).find((option) => {
            return option.id === searchParams.get('metric');
        });
    }, [resultSetSchema, searchParams]);

    const yearTo = useMemo(() => {
        return hazardFiltersFormValuesFromUrlSearchParams?.yearTo;
    }, [hazardFiltersFormValuesFromUrlSearchParams]);

    const yearFrom = useMemo<number>(() => {
        return (
            hazardFiltersFormValuesFromUrlSearchParams?.yearFrom ||
            RESULT_SET_DEFAULT_YEAR_FROM
        );
    }, [hazardFiltersFormValuesFromUrlSearchParams]);

    return {
        hazardFiltersFormValuesFromUrlSearchParams,
        perilsResultSet,
        yearTo,
        yearFrom,
        isResultSetSchemaLoading,
        isResultSetLoading,
        resultSetSchema,
        portfolioId,
        HAZARD_SCORES,
        disabledScores,
        selectedScore,
        setSelectedScore,
        resultSetOptions,
        handleFiltersChange,
        selectedMetric,
        isResultSetError,
        isResultSetSchemaError,
    };
};
