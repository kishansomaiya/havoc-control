import { Box, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useParams } from 'react-router';
import { usePortfolioFloodMeshDataQuery } from '../../../api/queries/resultSetsQuery';
import { useMemo } from 'react';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';
import { usePortfolioFloodMeshData } from '../../../hooks/usePortfolioFloodMeshData';
import {
    MeshOptionsDataVersionEnum,
    PerilsOptions,
} from '../../../api/openapi/auto-generated';
import { LocationFloodMeshFiltersForm } from './components/LocationFloodMeshFiltersForm';
import { LocationFloodMeshMap } from './components/LocationFloodMeshMap';
import { NO_AVAILABLE_SCORE, SCORE_LEVEL_COLORS } from '../../../const';
import { ScoreLevel, ScoreLevelCounts } from '../../../types';
import { convertToPercentage, isNumber } from '../../../utils';
import { LocationFloodMeshGridChart } from './components/LocationFloodMeshGridChart';
import { LocationFloodMeshMetricsComparison } from './components/LocationFloodMeshMetricsComparison';

const defaultScoreLevelCounts: ScoreLevelCounts = {
    [ScoreLevel.NA]: 0,
    [ScoreLevel.Lowest]: 0,
    [ScoreLevel.Low]: 0,
    [ScoreLevel.Medium]: 0,
    [ScoreLevel.High]: 0,
    [ScoreLevel.Highest]: 0,
};

const floodMeshMetricValueFormatter = (
    mean: number,
    isFractionMetric: boolean
): number => (isFractionMetric ? (convertToPercentage(mean) as number) : mean);

export const LocationFloodMeshTab = () => {
    const {
        floodMeshFiltersFormValuesFromUrlSearchParams,
        floodMeshResultSet,
        yearTo,
        yearFrom,
        isResultSetSchemaLoading,
        isResultSetLoading,
        resultSetSchema,
        resultSetOptions,
        handleFiltersChange,
        isResultSetError,
        isResultSetSchemaError,
        selectedMetric,
    } = usePortfolioFloodMeshData();
    const { locationId } = useParams();

    const dataVersion = useMemo<MeshOptionsDataVersionEnum | undefined>(
        () => resultSetOptions?.dataVersion,
        [resultSetOptions]
    );

    const {
        portfolioFloodMeshData,
        isPortfolioFloodMeshDataLoading,
        isPortfolioFloodMeshDataError,
    } = usePortfolioFloodMeshDataQuery({
        resultSetId: floodMeshResultSet?.id,
        locationId,
        yearFrom,
        yearTo,
        metric: selectedMetric?.id,
        scenario: floodMeshFiltersFormValuesFromUrlSearchParams.scenario,
    });

    const showLoadingIndicator = useMemo(() => {
        return (
            isResultSetSchemaLoading ||
            isResultSetLoading ||
            isPortfolioFloodMeshDataLoading
        );
    }, [
        isResultSetSchemaLoading,
        isResultSetLoading,
        isPortfolioFloodMeshDataLoading,
    ]);

    const showDataLoadingErrorMessage = useMemo(() => {
        return (
            !isResultSetSchemaLoading &&
            !isResultSetLoading &&
            (isResultSetError ||
                isResultSetSchemaError ||
                isPortfolioFloodMeshDataError ||
                !floodMeshResultSet)
        );
    }, [
        isResultSetSchemaLoading,
        isResultSetLoading,
        isResultSetError,
        isResultSetSchemaError,
        isPortfolioFloodMeshDataError,
        floodMeshResultSet,
    ]);

    const tabDataLoaded = useMemo(() => {
        return (
            !isResultSetSchemaLoading &&
            !isResultSetLoading &&
            resultSetSchema.length > 0
        );
    }, [isResultSetSchemaLoading, isResultSetLoading, resultSetSchema.length]);

    const isFractionMetric = useMemo(
        () =>
            selectedMetric &&
            selectedMetric.id.toLowerCase().includes('fraction'),
        [selectedMetric]
    );

    const portfolioFloodMeshMapData = useMemo(() => {
        if (!selectedMetric) {
            return [];
        }

        return portfolioFloodMeshData
            .filter(({ year }) => year === yearTo)
            .map(({ longitude, latitude, mean, tier }) => ({
                longitude,
                latitude,
                color:
                    SCORE_LEVEL_COLORS[tier] ||
                    SCORE_LEVEL_COLORS[ScoreLevel.NA],
                label:
                    mean === NO_AVAILABLE_SCORE
                        ? 'N/A'
                        : isFractionMetric
                          ? `${convertToPercentage(mean)?.toFixed(0)}%`
                          : mean.toFixed(1),
            }));
    }, [portfolioFloodMeshData, yearTo, selectedMetric, isFractionMetric]);

    const scoreLevelCounts = useMemo<ScoreLevelCounts>(() => {
        if (!yearTo) {
            return defaultScoreLevelCounts;
        }

        if (!portfolioFloodMeshData?.length) {
            return defaultScoreLevelCounts;
        }

        const scoreLevels: ScoreLevel[] = portfolioFloodMeshData
            .filter(({ year }) => year.toString() === yearTo.toString())
            .map(({ tier, mean }) =>
                mean === NO_AVAILABLE_SCORE || !tier ? ScoreLevel.NA : tier
            );

        return scoreLevels.reduce(
            (acc: ScoreLevelCounts, level: ScoreLevel) => {
                if (acc[level] !== undefined) {
                    acc[level] += 1;
                } else {
                    acc[level] = 1;
                }
                return acc;
            },
            {
                [ScoreLevel.NA]: 0,
                [ScoreLevel.Lowest]: 0,
                [ScoreLevel.Low]: 0,
                [ScoreLevel.Medium]: 0,
                [ScoreLevel.High]: 0,
                [ScoreLevel.Highest]: 0,
            }
        );
    }, [yearTo, portfolioFloodMeshData]);

    const yearFromValues = useMemo(() => {
        return portfolioFloodMeshData
            .filter(
                ({ year, mean }) =>
                    year.toString() === yearFrom.toString() &&
                    isNumber(mean) &&
                    mean !== NO_AVAILABLE_SCORE
            )
            .map(({ mean }) =>
                floodMeshMetricValueFormatter(mean, !!isFractionMetric)
            );
    }, [portfolioFloodMeshData, yearFrom, isFractionMetric]);

    const yearToValues = useMemo(() => {
        return portfolioFloodMeshData
            .filter(
                ({ year, mean }) =>
                    year.toString() === yearTo.toString() &&
                    isNumber(mean) &&
                    mean !== NO_AVAILABLE_SCORE
            )
            .map(({ mean }) =>
                floodMeshMetricValueFormatter(mean, !!isFractionMetric)
            );
    }, [portfolioFloodMeshData, yearTo, isFractionMetric]);

    return (
        <Box
            display="flex"
            height="100%"
            flexDirection="column"
            data-testid="slp-floodmesh-body"
        >
            {tabDataLoaded && (
                <Grid
                    container
                    height="100%"
                >
                    <Grid
                        xs={6}
                        height="100%"
                        overflow="hidden"
                        position="relative"
                        data-testid="slp-floodmesh-map"
                    >
                        <LocationFloodMeshMap
                            locations={portfolioFloodMeshMapData}
                        />
                    </Grid>
                    <Grid
                        xs={6}
                        height="100%"
                        overflow="auto"
                        display="flex"
                        flexDirection="column"
                    >
                        {resultSetOptions && resultSetSchema && (
                            <LocationFloodMeshFiltersForm
                                px={4}
                                py={2}
                                urlFilterParams={
                                    floodMeshFiltersFormValuesFromUrlSearchParams
                                }
                                resultSetOptions={
                                    resultSetOptions as PerilsOptions
                                }
                                resultSetSchema={resultSetSchema}
                                onFiltersChange={handleFiltersChange}
                                data-testid="slp-floodmesh-filters-form"
                            />
                        )}
                        <Divider />
                        <LocationFloodMeshMetricsComparison
                            yearFromValues={yearFromValues}
                            yearToValues={yearToValues}
                            yearTo={yearTo || yearFrom}
                            yearFrom={yearFrom}
                            isFractionMetric={!!isFractionMetric}
                            data-testid="slp-floodmesh-metrics"
                        />
                        <Divider />
                        <LocationFloodMeshGridChart
                            selectedMetric={selectedMetric}
                            scoreLevelCounts={scoreLevelCounts}
                            dataVersion={dataVersion}
                            isFractionMetric={!!isFractionMetric}
                            data-testid="slp-floodmesh-chart"
                        />
                    </Grid>
                </Grid>
            )}

            {showLoadingIndicator && <TabLoadingIndicator />}

            {showDataLoadingErrorMessage && <TabDataNotAvailableMessage />}
        </Box>
    );
};
