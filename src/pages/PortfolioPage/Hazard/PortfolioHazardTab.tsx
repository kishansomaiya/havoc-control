import { Box, Divider } from '@mui/material';
import { IPortfolioItem, ScoreLevel, ScoreLevelCounts } from '../../../types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { ScoreSwitcher } from '../../../components/ScoreSwitcher/ScoreSwitcher';
import { ScoreLevelsMapLegend } from '../../../components/Map/ScoreLevelsMapLegend';
import { LocationInHazardAreasCharts } from './components/LocationInHazardAreasCharts';
import {
    HazardTableLocation,
    LocationHazardDriversTable,
} from './components/LocationHazardDriversTable';
import { usePortfolioHazardDataQuery } from '../../../api/queries/resultSetsQuery';
import { HazardFiltersForm } from './components/HazardFiltersForm';
import { LocationsHazardMap } from './components/LocationsHazardMap';
import { NO_AVAILABLE_SCORE } from '../../../const';
import { usePortfolioHazardData } from '../../../hooks/usePortfolioHazardData';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';
import { DataNotAvailableModal } from '../../../components/DataNotAvailableModal/DataNotAvailableModal';
import {
    PerilsOptions,
    PerilsOptionsDataVersionEnum,
} from '../../../api/openapi/auto-generated';
import {
    getDefaultPortfolioPageUrl,
    getHazardUnitOfMeasure,
} from '../../../utils';
import { useOutletContext } from 'react-router';
import {
    useDashboardFilterContext,
    useDashboardResultSetIdContextUpdate,
} from '../../../context/DashboardFilterProvider';

const defaultScoreLevelCounts: ScoreLevelCounts = {
    [ScoreLevel.NA]: 0,
    [ScoreLevel.Lowest]: 0,
    [ScoreLevel.Low]: 0,
    [ScoreLevel.Medium]: 0,
    [ScoreLevel.High]: 0,
    [ScoreLevel.Highest]: 0,
};

export const PortfolioHazardTab = () => {
    const [isDataNotAvailableModalOpen, setIsDataNotAvailableModalOpen] =
        useState(false);
    const [
        isPortfolioHazardDataInitialized,
        setIsPortfolioHazardDataInitialized,
    ] = useState(false);
    const [selectedScoreLevel, setSelectedScoreLevel] =
        useState<ScoreLevel | null>(null);
    const { portfolioItem } = useOutletContext<{
        portfolioItem: IPortfolioItem;
    }>();

    const { filterLists } = useDashboardFilterContext();
    const updateDashboardFilterResultSetId =
        useDashboardResultSetIdContextUpdate();
    const {
        hazardFiltersFormValuesFromUrlSearchParams,
        perilsResultSet,
        yearTo,
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
    } = usePortfolioHazardData();

    const {
        portfolioHazardData,
        isPortfolioHazardDataLoading,
        isPortfolioHazardDataError,
        isPortfolioHazardDataFetched,
    } = usePortfolioHazardDataQuery({
        ...hazardFiltersFormValuesFromUrlSearchParams,
        resultSetId: perilsResultSet?.id,
        filters: filterLists as Record<string, string[]>,
    });

    const dataVersion = useMemo<PerilsOptionsDataVersionEnum | undefined>(
        () => resultSetOptions?.dataVersion,
        [resultSetOptions]
    );

    const filteredHazardDataByScoreLevel = useMemo(() => {
        if (!selectedScoreLevel) {
            return portfolioHazardData;
        }
        return portfolioHazardData.filter(
            (locationData) => locationData.tier === selectedScoreLevel
        );
    }, [selectedScoreLevel, portfolioHazardData]);

    const tableLocations = useMemo<HazardTableLocation[]>(() => {
        const { yearTo, yearFrom } = hazardFiltersFormValuesFromUrlSearchParams;
        if (!yearTo || !yearFrom) {
            return [];
        }

        if (!filteredHazardDataByScoreLevel?.length) {
            return [];
        }

        const groupedLocations: { [locationId: number]: HazardTableLocation } =
            {};
        filteredHazardDataByScoreLevel.forEach(
            ({ locationId, locationName, year, mean }) => {
                if (!groupedLocations[locationId]) {
                    groupedLocations[locationId] = {
                        locationId,
                        locationName,
                        // Initialize with an empty object to allow dynamic year properties
                        ...Object.create(null),
                    };
                }
                groupedLocations[locationId]['diff'] = null;
                groupedLocations[locationId][year.toString()] =
                    mean === NO_AVAILABLE_SCORE ? null : mean;
            }
        );

        return Object.values(groupedLocations).map((location) => {
            if (
                (!location[yearFrom] && location[yearFrom] !== 0) ||
                (!location[yearTo] && location[yearTo] !== 0)
            ) {
                return location;
            } else {
                location['diff'] =
                    Number(location[yearTo]) - Number(location[yearFrom]);
                return location;
            }
        });
        // .sort((locationA, locationB) =>
        //     // Sort by change in descending order
        //     {
        //         if (
        //             (!locationA[yearFrom] && locationA[yearFrom] !== 0) ||
        //             (!locationA[yearTo] && locationA[yearTo] !== 0)
        //         ) {
        //             return 1;
        //         }
        //         if (
        //             (!locationB[yearFrom] && locationB[yearFrom] !== 0) ||
        //             (!locationB[yearTo] && locationB[yearTo] !== 0)
        //         ) {
        //             return -1;
        //         }
        //         return Number(locationA[yearTo]) -
        //             Number(locationA[yearFrom]) >
        //             Number(locationB[yearTo]) - Number(locationB[yearFrom])
        //             ? -1
        //             : 1;
        //     }
        // );
    }, [
        filteredHazardDataByScoreLevel,
        hazardFiltersFormValuesFromUrlSearchParams,
    ]);

    const scoreLevelCounts = useMemo<ScoreLevelCounts>(() => {
        if (!yearTo) {
            return defaultScoreLevelCounts;
        }

        if (!portfolioHazardData?.length) {
            return defaultScoreLevelCounts;
        }

        const scoreLevels: ScoreLevel[] = portfolioHazardData
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
    }, [yearTo, portfolioHazardData]);

    useEffect(() => {
        if (
            !isResultSetSchemaLoading &&
            !isResultSetLoading &&
            !perilsResultSet
        ) {
            setIsDataNotAvailableModalOpen(true);
        }
    }, [perilsResultSet, isResultSetSchemaLoading, isResultSetLoading]);

    useEffect(() => {
        updateDashboardFilterResultSetId(perilsResultSet?.id);
    }, [perilsResultSet, updateDashboardFilterResultSetId]);

    useEffect(() => {
        if (isPortfolioHazardDataFetched) {
            setIsPortfolioHazardDataInitialized(true);
        }
    }, [isPortfolioHazardDataFetched]);

    const handleCloseAvailableModalOpen = useCallback(() => {
        setIsDataNotAvailableModalOpen(false);
    }, []);

    const handleFilterByScoreLevel = useCallback(
        (level: ScoreLevel) => {
            setSelectedScoreLevel((pre) => (pre === level ? null : level));
        },
        [setSelectedScoreLevel]
    );

    const defaultNavigateRoute = useMemo(
        () => getDefaultPortfolioPageUrl(portfolioItem),
        [portfolioItem]
    );

    const showLoadingIndicator = useMemo(() => {
        return (
            isResultSetSchemaLoading ||
            isResultSetLoading ||
            isPortfolioHazardDataLoading
        );
    }, [
        isResultSetSchemaLoading,
        isResultSetLoading,
        isPortfolioHazardDataLoading,
    ]);

    const showDataLoadingErrorMessage = useMemo(() => {
        return (
            !isResultSetSchemaLoading &&
            !isResultSetLoading &&
            !isPortfolioHazardDataLoading &&
            (isResultSetError ||
                isResultSetSchemaError ||
                isPortfolioHazardDataError)
        );
    }, [
        isResultSetSchemaLoading,
        isResultSetLoading,
        isPortfolioHazardDataLoading,
        isResultSetError,
        isResultSetSchemaError,
        isPortfolioHazardDataError,
    ]);

    const metricUnitOfMeasure = useMemo(
        () => getHazardUnitOfMeasure(selectedMetric),
        [selectedMetric]
    );

    return (
        <Box
            flexGrow="1"
            overflow="auto"
            position="relative"
        >
            {!isResultSetSchemaLoading &&
                !isResultSetLoading &&
                resultSetSchema.length > 0 && (
                    <Grid
                        height="100%"
                        container
                        spacing={0}
                        data-testid="portfolio-hazard-body"
                    >
                        <Grid
                            xs={6}
                            height="100%"
                            overflow="hidden"
                            position="relative"
                            data-testid="portfolio-hazard-map"
                        >
                            {portfolioId &&
                                yearTo &&
                                isPortfolioHazardDataInitialized && (
                                    <LocationsHazardMap
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        portfolioId={portfolioId}
                                        portfolioHazardData={
                                            filteredHazardDataByScoreLevel || []
                                        }
                                        yearTo={yearTo}
                                    />
                                )}
                            <Box
                                position="absolute"
                                top="1rem"
                                left={0}
                                width="100%"
                                textAlign="center"
                                data-testid="portfolio-hazard-score-switcher"
                            >
                                <ScoreSwitcher
                                    scores={HAZARD_SCORES}
                                    disabledScores={disabledScores}
                                    selectedScore={selectedScore}
                                    onSelectScore={setSelectedScore}
                                />
                            </Box>
                            <Box
                                position="absolute"
                                bottom="1.5rem"
                                right="1.5rem"
                                data-testid="portfolio-hazard-score-map-legend"
                            >
                                <ScoreLevelsMapLegend />
                            </Box>
                        </Grid>
                        <Grid
                            xs={6}
                            height="100%"
                            overflow="auto"
                            display="flex"
                            flexDirection="column"
                            data-testid="portfolio-hazard-content-block"
                        >
                            {resultSetOptions && resultSetSchema && (
                                <HazardFiltersForm
                                    px={4}
                                    py={2}
                                    urlFilterParams={
                                        hazardFiltersFormValuesFromUrlSearchParams
                                    }
                                    score={selectedScore}
                                    resultSetOptions={
                                        resultSetOptions as PerilsOptions
                                    }
                                    resultSetSchema={resultSetSchema}
                                    onFiltersChange={handleFiltersChange}
                                    data-testid="portfolio-hazard-filters-form"
                                />
                            )}
                            <Divider />
                            <Box
                                px={4}
                                py={2}
                            >
                                {selectedMetric && (
                                    <LocationInHazardAreasCharts
                                        score={selectedScore}
                                        metric={selectedMetric}
                                        scoreLevelCounts={scoreLevelCounts}
                                        dataVersion={dataVersion}
                                        selectedScoreLevel={selectedScoreLevel}
                                        onFilterByScoreLevel={
                                            handleFilterByScoreLevel
                                        }
                                        data-testid="portfolio-hazard-chart"
                                    />
                                )}
                            </Box>
                            <Divider />
                            <Box
                                px={4}
                                pt={2}
                                pb={0}
                                flexGrow={1}
                                data-testid="portfolio-hazard-location-drivers-table"
                            >
                                {portfolioId && (
                                    <LocationHazardDriversTable
                                        hazardLocations={tableLocations}
                                        score={selectedScore}
                                        yearFrom={
                                            hazardFiltersFormValuesFromUrlSearchParams.yearFrom
                                        }
                                        yearTo={yearTo}
                                        portfolioId={portfolioId}
                                        unitOfMeasure={metricUnitOfMeasure}
                                    />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                )}
            {showLoadingIndicator && <TabLoadingIndicator />}

            {showDataLoadingErrorMessage && <TabDataNotAvailableMessage />}

            {isDataNotAvailableModalOpen && (
                <DataNotAvailableModal
                    defaultRoute={defaultNavigateRoute}
                    onClose={handleCloseAvailableModalOpen}
                />
            )}
        </Box>
    );
};
