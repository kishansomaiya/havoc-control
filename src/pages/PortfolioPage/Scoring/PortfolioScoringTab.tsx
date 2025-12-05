import { Box, Divider, Typography } from '@mui/material';
import { usePortfolioResultSetData } from '../../../hooks/usePortfolioResultSetData';
import {
    ResultSetType,
    ScoresResultSetOptions,
} from '../../../api/openapi/auto-generated';
import {
    ScoringFiltersForm,
    ScoringFilterValues,
} from './components/ScoringFiltersForm';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    BenchmarkLevel,
    GLOBAL_BENCHMARK_LEVEL,
    IPortfolioItem,
    Score,
} from '../../../types';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';
import Grid from '@mui/material/Unstable_Grid2';
import { usePortfolioScoringDataQuery } from '../../../api/queries/resultSetsQuery';
import { LocationsScoringMap } from './components/LocationsScoringMap';
import { AverageScoringCharts } from './components/AverageScoringCharts';
import { LocationsScoringChart } from './components/LocationScoringChart/LocationsScoringChart';
import { ScoringLocationIdContext } from './PrortfolioScoringContext';
import { DataNotAvailableModal } from '../../../components/DataNotAvailableModal/DataNotAvailableModal';
import { useOutletContext } from 'react-router';
import { getDefaultPortfolioPageUrl } from '../../../utils';
import {
    useDashboardFilterContext,
    useDashboardResultSetIdContextUpdate,
} from '../../../context/DashboardFilterProvider';

export const PortfolioScoringTab = () => {
    const [isDataNotAvailableModalOpen, setIsDataNotAvailableModalOpen] =
        useState(false);
    const { portfolioItem } = useOutletContext<{
        portfolioItem: IPortfolioItem;
    }>();

    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedLocationId, setSelectedLocationId] = useState<
        number | undefined
    >();
    const { filterLists } = useDashboardFilterContext();
    const updateDashboardFilterResultSetId =
        useDashboardResultSetIdContextUpdate();
    const {
        portfolioId,
        resultSet,
        isResultSetLoading,
        isResultSetError,
        resultSetOptions,
    } = usePortfolioResultSetData<ScoresResultSetOptions>(ResultSetType.scores);

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

    useEffect(() => {
        if (!isResultSetLoading && !resultSet) {
            setIsDataNotAvailableModalOpen(true);
        }
    }, [resultSet, isResultSetLoading]);

    useEffect(() => {
        updateDashboardFilterResultSetId(resultSet?.id);
    }, [resultSet, updateDashboardFilterResultSetId]);

    const handleCloseAvailableModalOpen = useCallback(() => {
        setIsDataNotAvailableModalOpen(false);
    }, []);

    const defaultNavigateRoute = useMemo(
        () => getDefaultPortfolioPageUrl(portfolioItem),
        [portfolioItem]
    );

    const scoringFiltersFormValuesFromUrlSearchParams =
        useMemo<ScoringFilterValues>(() => {
            return {
                peril: searchParams.get('peril') as Score,
                benchmarkLevel:
                    (searchParams.get('benchmarkLevel') as BenchmarkLevel) ??
                    GLOBAL_BENCHMARK_LEVEL,
            };
        }, [searchParams]);

    const {
        portfolioScoringData,
        isPortfolioScoringDataLoading,
        isPortfolioScoringDataError,
    } = usePortfolioScoringDataQuery({
        resultSetId: resultSet?.id,
        benchmarkLevel:
            scoringFiltersFormValuesFromUrlSearchParams.benchmarkLevel,
        score: scoringFiltersFormValuesFromUrlSearchParams.peril,
        filters: filterLists as Record<string, string[]>,
    });

    const handleLocationSelection = useCallback(
        (locationId: number | undefined) => {
            setSelectedLocationId(locationId);
        },
        []
    );

    const handleClearLocationSelection = useCallback(() => {
        setSelectedLocationId(undefined);
    }, []);

    const filteredScoringData = useMemo(() => {
        return portfolioScoringData.filter(
            ({ locationId }) =>
                locationId === selectedLocationId || !selectedLocationId
        );
    }, [selectedLocationId, portfolioScoringData]);

    const showLoadingIndicator = useMemo(() => {
        return isResultSetLoading || isPortfolioScoringDataLoading;
    }, [isResultSetLoading, isPortfolioScoringDataLoading]);

    const showDataLoadingErrorMessage = useMemo(() => {
        return (
            !isResultSetLoading &&
            !isPortfolioScoringDataLoading &&
            (isResultSetError || isPortfolioScoringDataError)
        );
    }, [
        isResultSetLoading,
        isResultSetError,
        isPortfolioScoringDataLoading,
        isPortfolioScoringDataError,
    ]);

    return (
        <Box
            display="flex"
            height="100%"
            flexDirection="column"
            position="relative"
            overflow="auto"
            data-testid="scoring-body"
        >
            <ScoringLocationIdContext.Provider value={selectedLocationId}>
                <Box>
                    {resultSetOptions && (
                        <ScoringFiltersForm
                            resultSetOptions={resultSetOptions}
                            onFiltersChange={handleFiltersChange}
                            urlFilterParams={
                                scoringFiltersFormValuesFromUrlSearchParams
                            }
                        />
                    )}
                </Box>
                <Divider />
                <Box
                    flexGrow={1}
                    overflow="auto"
                    position="relative"
                >
                    <Grid
                        container
                        height="100%"
                        position="relative"
                        overflow="auto"
                        data-testid="scoring-chart"
                    >
                        <Grid
                            xs={6}
                            px={4}
                            py={3}
                            height="100%"
                            position="relative"
                        >
                            <LocationsScoringChart
                                portfolioScoringData={portfolioScoringData}
                                onLocationSelected={handleLocationSelection}
                            />
                        </Grid>
                        <Grid xs={0}>
                            <Divider orientation="vertical" />
                        </Grid>
                        <Grid
                            xs={6}
                            px={4}
                            pt={3}
                            pb={1}
                            height="100%"
                            position="relative"
                            display="flex"
                            flexDirection="column"
                            data-testid="hazard-scores"
                        >
                            <Box pb={3}>
                                <Typography
                                    variant="h1"
                                    pb={1}
                                    data-testid="hazard-scores-title"
                                >
                                    Hazard Scores
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    data-testid="hazard-scores-description"
                                >
                                    Examine your portfolio to see how it scores
                                    for present-day hazards and how those
                                    hazards will change in 2050. See if your
                                    locations are experiencing rapid changes in
                                    climate conditions that will require
                                    mitigation plans to be accelerated. The
                                    quadrant view displays dots placed based on
                                    average scores and colored based on a
                                    predetermined risk scale. Scores are
                                    generated using climate scenario SSP5-8.5.
                                </Typography>
                            </Box>
                            <AverageScoringCharts
                                portfolioScoringData={filteredScoringData}
                                onClearLocationSelection={
                                    handleClearLocationSelection
                                }
                            />
                            <Box
                                flexGrow={1}
                                overflow="auto"
                                position="relative"
                            >
                                {!!portfolioId && (
                                    <LocationsScoringMap
                                        portfolioId={portfolioId}
                                        portfolioScoringData={
                                            portfolioScoringData
                                        }
                                        selectedLocationId={selectedLocationId}
                                        onLocationSelected={
                                            handleLocationSelection
                                        }
                                        data-testid="hazard-scores-map"
                                    />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {showLoadingIndicator && <TabLoadingIndicator />}

                {showDataLoadingErrorMessage && <TabDataNotAvailableMessage />}
            </ScoringLocationIdContext.Provider>

            {isDataNotAvailableModalOpen && (
                <DataNotAvailableModal
                    defaultRoute={defaultNavigateRoute}
                    onClose={handleCloseAvailableModalOpen}
                />
            )}
        </Box>
    );
};
