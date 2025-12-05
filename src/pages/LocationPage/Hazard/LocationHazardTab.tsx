import { Box, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useParams } from 'react-router';
import { ScoreSwitcher } from '../../../components/ScoreSwitcher/ScoreSwitcher';
import { usePortfolioHazardData } from '../../../hooks/usePortfolioHazardData';
import { useGetLocationHazardDataQuery } from '../../../api/queries/resultSetsQuery';
import { LocationHazardFiltersForm } from './components/LocationHazardFiltersForm';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Scenario } from '../../../types';
import { useMetricSelectOptions } from '../../../hooks/useHazardFilterOptions';
import { DEFAULT_METRIC_VALUES } from '../../../const/defaultMetricValues';
import { LocationHazardMetricComparisonTable } from './components/LocationHazardMetricComparisonTable';
import { LocationHazardValuesOverTimeGraph } from './components/LocationHazardValuesOverTimeGraph';
import { RESULT_SET_MIN_YEAR_FROM } from '../../../const';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';

export const LocationHazardTab = () => {
    const {
        hazardFiltersFormValuesFromUrlSearchParams,
        perilsResultSet,
        yearTo,
        yearFrom,
        isResultSetSchemaLoading,
        isResultSetLoading,
        resultSetSchema,
        HAZARD_SCORES,
        disabledScores,
        selectedScore,
        setSelectedScore,
        resultSetOptions,
        handleFiltersChange,
        isResultSetError,
        isResultSetSchemaError,
        selectedMetric,
    } = usePortfolioHazardData();
    const { locationId } = useParams();

    const metricSelectOptions = useMetricSelectOptions({
        resultSetSchema,
        score: selectedScore,
    });

    const metricIds = useMemo<string[]>(() => {
        const meanMetricIds = metricSelectOptions.map(({ id }) => id);
        const upperMetricIds = meanMetricIds.map((id) =>
            id.replace('mean', 'upper')
        );
        const lowerMetricIds = meanMetricIds.map((id) =>
            id.replace('mean', 'lower')
        );
        return [...meanMetricIds, ...upperMetricIds, ...lowerMetricIds];
    }, [metricSelectOptions]);

    const resultSetOptionsYears = useMemo(
        () => resultSetOptions?.years ?? [],
        [resultSetOptions]
    );

    const {
        locationHazardData,
        isLocationHazardDataLoading,
        isLocationHazardDataError,
    } = useGetLocationHazardDataQuery({
        resultSetId: perilsResultSet?.id,
        locationId,
        peril: selectedScore,
        years: resultSetOptionsYears,
        metricIds,
        scenario: hazardFiltersFormValuesFromUrlSearchParams.scenario,
    });

    const [selectedMetricId, setSelectedMetricId] = useState<
        string | undefined
    >();

    const handleLocationFiltersChange = useCallback(
        (values: { yearFrom: number; yearTo: number; scenario: Scenario }) => {
            handleFiltersChange({
                ...values,
                peril: selectedScore,
                metric: selectedMetricId || '',
            });
        },
        [handleFiltersChange, selectedScore, selectedMetricId]
    );

    useEffect(() => {
        if (!metricSelectOptions || metricSelectOptions.length === 0) {
            setSelectedMetricId(undefined);
            return;
        }

        const { metric } = hazardFiltersFormValuesFromUrlSearchParams;
        if (metric && metricSelectOptions.find(({ id }) => id === metric)) {
            setSelectedMetricId(metric);
            return;
        }
        let defaultMetricOption = metricSelectOptions.find(({ id }) =>
            DEFAULT_METRIC_VALUES.includes(id)
        );

        defaultMetricOption = defaultMetricOption || metricSelectOptions[0];

        setSelectedMetricId(defaultMetricOption.id);
    }, [
        metricSelectOptions,
        setSelectedMetricId,
        hazardFiltersFormValuesFromUrlSearchParams,
    ]);

    const handleMetricIdChange = useCallback(
        (metricId: string) => {
            setSelectedMetricId(metricId);
        },
        [setSelectedMetricId]
    );

    const metricComparisonData = useMemo<
        Record<string, Record<number, number | undefined>>
    >(() => {
        const result: Record<string, Record<number, number | undefined>> = {};
        const meanMetricIds = metricSelectOptions.map(({ id }) => id);
        meanMetricIds.forEach((metricId) => {
            result[metricId] = {};
        });

        locationHazardData.forEach(
            (locationData: {
                locationId: number;
                year: number;
                [key: string]: number | undefined;
            }) => {
                meanMetricIds.forEach((metricId) => {
                    result[metricId][locationData.year] =
                        locationData[metricId];
                });
            }
        );

        return result;
    }, [locationHazardData, metricSelectOptions]);

    const graphYearRange = useMemo(() => {
        return (resultSetOptions?.years || []).filter(
            (year) => year >= RESULT_SET_MIN_YEAR_FROM
        );
    }, [resultSetOptions]);

    const graphData = useMemo(() => {
        const result: Record<string, Record<number, number | undefined>> = {
            mean: {},
            lower: {},
            upper: {},
        };

        if (!selectedMetricId) {
            return result;
        }

        locationHazardData.forEach(
            (locationData: {
                locationId: number;
                year: number;
                [key: string]: number | undefined;
            }) => {
                Object.keys(result).forEach((metricType) => {
                    const metricId = selectedMetricId.replace(
                        'mean',
                        metricType
                    );
                    result[metricType][locationData.year] =
                        locationData[metricId];
                });
            }
        );

        return result;
    }, [locationHazardData, selectedMetricId]);

    const showLoadingIndicator = useMemo(() => {
        return (
            isResultSetSchemaLoading ||
            isResultSetLoading ||
            isLocationHazardDataLoading
        );
    }, [
        isResultSetSchemaLoading,
        isResultSetLoading,
        isLocationHazardDataLoading,
    ]);

    const showDataLoadingErrorMessage = useMemo(() => {
        return (
            !isResultSetSchemaLoading &&
            !isResultSetLoading &&
            (isResultSetError ||
                isResultSetSchemaError ||
                isLocationHazardDataError ||
                !perilsResultSet)
        );
    }, [
        isResultSetSchemaLoading,
        isResultSetLoading,
        isResultSetError,
        isResultSetSchemaError,
        isLocationHazardDataError,
        perilsResultSet,
    ]);

    const tabDataLoaded = useMemo(() => {
        return (
            !isResultSetSchemaLoading &&
            !isResultSetLoading &&
            resultSetSchema.length > 0
        );
    }, [isResultSetSchemaLoading, isResultSetLoading, resultSetSchema.length]);

    return (
        <Box
            display="flex"
            height="100%"
            flexDirection="column"
            position="relative"
            overflow="auto"
            data-testid="slp-hazard-body"
        >
            {tabDataLoaded && (
                <>
                    <Box data-testid="slp-hazard-scoretabs-filters">
                        <Grid container>
                            <Grid
                                xs={6}
                                px={4}
                                py={2}
                                data-testid="slp-hazard-score-switcher"
                            >
                                <ScoreSwitcher
                                    fullWidth
                                    scores={HAZARD_SCORES}
                                    disabledScores={disabledScores}
                                    selectedScore={selectedScore}
                                    onSelectScore={setSelectedScore}
                                />
                            </Grid>
                            <Grid xs={0}>
                                <Divider orientation="vertical" />
                            </Grid>
                            <Grid
                                xs={6}
                                px={4}
                                py={2}
                                data-testid="slp-hazard-filters"
                            >
                                {resultSetOptions && (
                                    <LocationHazardFiltersForm
                                        urlFilterParams={
                                            hazardFiltersFormValuesFromUrlSearchParams
                                        }
                                        resultSetOptions={resultSetOptions}
                                        onFiltersChange={
                                            handleLocationFiltersChange
                                        }
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box
                        flexGrow={1}
                        overflow="auto"
                        position="relative"
                        data-testid="slp-hazard-metrics-chart"
                    >
                        <Grid
                            container
                            height="100%"
                            position="relative"
                            overflow="auto"
                        >
                            <Grid
                                xs={6}
                                px={4}
                                pt={3}
                                pb={2}
                                height="100%"
                                position="relative"
                                overflow="auto"
                                data-testid="slp-hazard-metrics"
                            >
                                {selectedMetricId && yearTo && (
                                    <LocationHazardMetricComparisonTable
                                        yearFrom={yearFrom}
                                        yearTo={yearTo}
                                        metrics={metricSelectOptions}
                                        selectedMetricId={selectedMetricId}
                                        metricComparisonData={
                                            metricComparisonData
                                        }
                                        onMetricIdChange={handleMetricIdChange}
                                    />
                                )}
                            </Grid>
                            <Grid xs={0}>
                                <Divider orientation="vertical" />
                            </Grid>
                            <Grid
                                xs={6}
                                px={4}
                                py={3}
                                data-testid="slp-hazard-chart"
                            >
                                {resultSetOptions && selectedMetric && (
                                    <LocationHazardValuesOverTimeGraph
                                        metric={selectedMetric}
                                        yearsRange={graphYearRange}
                                        graphData={graphData}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}

            {showLoadingIndicator && <TabLoadingIndicator />}

            {showDataLoadingErrorMessage && <TabDataNotAvailableMessage />}
        </Box>
    );
};
