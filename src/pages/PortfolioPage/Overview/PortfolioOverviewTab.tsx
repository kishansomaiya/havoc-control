import { Box, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { LocationsScoreMap } from './components/LocationsScoreMap';
import {
    ResultSetType,
    ScoresOptions,
    ScoresOptionsPerilsEnum,
} from '../../../api/openapi/auto-generated';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IPortfolioItem, Scenario, Score } from '../../../types';
import { ScoreSwitcher } from '../../../components/ScoreSwitcher/ScoreSwitcher';
import { PortfolioClimateScoreCharts } from './components/PortfolioClimateScoreCharts';
import { ScoreLevelsMapLegend } from '../../../components/Map/ScoreLevelsMapLegend';
import {
    NO_AVAILABLE_SCORE,
    SCORE_CHANGE_FIELDS,
    SCORE_HAZARD_FIELDS,
    SCORE_OVERALL_FIELDS,
} from '../../../const';
import { useResultSetDataQuery } from '../../../api/queries/resultSetsQuery';
import { LocationsScoreTable } from './components/LocationsScoreTable';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';
import { usePortfolioResultSetData } from '../../../hooks/usePortfolioResultSetData';
import { DataNotAvailableModal } from '../../../components/DataNotAvailableModal/DataNotAvailableModal';
import { getDefaultPortfolioPageUrl, getPortfolioResultDataVersion } from '../../../utils';
import { isVersionGreaterOrEqual } from '../../../utils/portfolio.util';
import { useOutletContext } from 'react-router';
import {
    useDashboardFilterContext,
    useDashboardResultSetIdContextUpdate,
} from '../../../context/DashboardFilterProvider';

type LocationScoreField =
    | (typeof SCORE_OVERALL_FIELDS)[keyof typeof SCORE_OVERALL_FIELDS]
    | (typeof SCORE_CHANGE_FIELDS)[keyof typeof SCORE_CHANGE_FIELDS]
    | (typeof SCORE_HAZARD_FIELDS)[keyof typeof SCORE_HAZARD_FIELDS];

type LocationScores = {
    [key in LocationScoreField]: number;
};

type LocationFields = {
    locationId: number;
    latitude: number;
    longitude: number;
    locationName: string | null;
};

export type LocationWithScores = LocationScores & LocationFields;

const scoreOverallFieldNames = Object.values(SCORE_OVERALL_FIELDS);
const scoreChangeFieldNames = Object.values(SCORE_CHANGE_FIELDS);
const scoreHazardFieldNames = Object.values(SCORE_HAZARD_FIELDS);

const locationFiledNames = [
    'locationId',
    'latitude',
    'longitude',
    'locationName',
];

const allLocationFieldNames = [
    ...locationFiledNames,
    ...scoreOverallFieldNames,
    ...scoreChangeFieldNames,
    ...scoreHazardFieldNames,
];

export const PortfolioOverviewTab = () => {
    const { portfolioItem } = useOutletContext<{
        portfolioItem: IPortfolioItem;
    }>();

    const [isDataNotAvailableModalOpen, setIsDataNotAvailableModalOpen] =
        useState(false);

    const [selectedScore, setSelectedScore] = useState(Score.Flood);
    const { filterLists } = useDashboardFilterContext();
    const updateDashboardFilterResultSetId =
        useDashboardResultSetIdContextUpdate();
    const {
        portfolioId,
        resultSet: scoreResultSet,
        isResultSetLoading,
        isResultSetError,
        resultSetOptions,
    } = usePortfolioResultSetData<ScoresOptions>(ResultSetType.scores);
    const { resultSetData, isResultSetDataLoading, isResultSetDataError } =
        useResultSetDataQuery<LocationWithScores[]>({
            resultSetId: scoreResultSet?.id,
            queryParams: {
                locationIds: [],
                include: allLocationFieldNames,
                filters: {
                    scenario: Scenario.SSP585,
                    ...filterLists,
                },
            },
        });

    // Get data version from portfolio
    const dataVersion = useMemo(() => {
        if (!portfolioItem) {
            return null;
        }
        return getPortfolioResultDataVersion(portfolioItem);
    }, [portfolioItem]);

    // Check if subsidence should be enabled based on data version
    const isSubsidenceEnabled = useMemo(
        () => isVersionGreaterOrEqual(dataVersion, '3.3.0'),
        [dataVersion]
    );

    const SCORES = useMemo(
        () => [
            Score.All,
            Score.Flood,
            Score.Wind,
            Score.Fire,
            Score.Heat,
            Score.Precipitation,
            Score.Cold,
            Score.Drought,
            Score.Hail,
            ...(isSubsidenceEnabled ? [Score.Subsidence] : []),
        ],
        [isSubsidenceEnabled]
    );

    const disabledScores = useMemo(
        () =>
            SCORES.filter(
                (score) =>
                    !resultSetOptions?.perils?.includes(
                        score as ScoresOptionsPerilsEnum
                    ) ||
                    resultSetData.every(
                        (location) =>
                            location?.[SCORE_OVERALL_FIELDS[score]] ===
                            NO_AVAILABLE_SCORE
                    )
            ),
        [resultSetOptions, resultSetData, SCORES]
    );

    useEffect(() => {
        if (!resultSetOptions) {
            return;
        }
        const enabledScores = SCORES.filter((score) => {
            return resultSetOptions?.perils?.includes(
                score as ScoresOptionsPerilsEnum
            );
        });

        if (enabledScores.includes(selectedScore)) {
            return;
        }

        const enabledScoresWithoutAll = enabledScores.filter(
            (score) => score !== Score.All
        );

        if (enabledScoresWithoutAll.length === 0) {
            setSelectedScore(Score.All);
            return;
        }

        setSelectedScore(enabledScoresWithoutAll[0]);
    }, [resultSetOptions, selectedScore, SCORES]);

    const showLoadingIndicator = useMemo(() => {
        return isResultSetDataLoading || isResultSetLoading;
    }, [isResultSetDataLoading, isResultSetLoading]);

    const showDataLoadingErrorMessage = useMemo(() => {
        return (
            !isResultSetDataLoading &&
            !isResultSetLoading &&
            (isResultSetDataError || isResultSetError)
        );
    }, [
        isResultSetDataLoading,
        isResultSetLoading,
        isResultSetDataError,
        isResultSetError,
    ]);

    useEffect(() => {
        if (!isResultSetLoading && !scoreResultSet) {
            setIsDataNotAvailableModalOpen(true);
        }
    }, [scoreResultSet, isResultSetLoading]);

    useEffect(() => {
        updateDashboardFilterResultSetId(scoreResultSet?.id);
    }, [scoreResultSet, updateDashboardFilterResultSetId]);

    const handleCloseAvailableModalOpen = useCallback(() => {
        setIsDataNotAvailableModalOpen(false);
    }, []);

    const defaultNavigateRoute = useMemo(
        () => getDefaultPortfolioPageUrl(portfolioItem),
        [portfolioItem]
    );

    return (
        <Box
            flexGrow="1"
            overflow="auto"
            position="relative"
        >
            {!isResultSetDataLoading &&
                !isResultSetDataError &&
                !isResultSetLoading &&
                portfolioId && (
                    <Grid
                        height="100%"
                        container
                        spacing={0}
                        data-testid="portfolio-overview-body"
                    >
                        <Grid
                            xs={6}
                            height="100%"
                            overflow="hidden"
                            position="relative"
                            data-testid="portfolio-overview-map"
                        >
                            <LocationsScoreMap
                                portfolioId={portfolioId}
                                locationWithScores={resultSetData}
                                selectedScore={selectedScore}
                            />
                            <Box
                                position="absolute"
                                top="1rem"
                                left={0}
                                width="100%"
                                textAlign="center"
                                data-testid="portfolio-overview-score-switcher"
                            >
                                <ScoreSwitcher
                                    scores={SCORES}
                                    disabledScores={disabledScores}
                                    selectedScore={selectedScore}
                                    onSelectScore={setSelectedScore}
                                />
                            </Box>
                            <Box
                                position="absolute"
                                bottom="1.5rem"
                                right="1.5rem"
                                data-testid="portfolio-overview-score-map-legend"
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
                        >
                            <Box
                                px={4}
                                py={3}
                                data-testid="portfolio-overview-climate-score-chart"
                            >
                                <PortfolioClimateScoreCharts
                                    locationWithScores={resultSetData}
                                    dataVersion={dataVersion}
                                />
                            </Box>
                            <Divider />
                            <Box
                                px={4}
                                pt={3}
                                pb={0}
                                display="flex"
                                flexGrow={1}
                                data-testid="portfolio-overview-location-score-table-block"
                            >
                                <LocationsScoreTable
                                    portfolioId={portfolioId}
                                    locationWithScores={resultSetData}
                                    selectedScore={selectedScore}
                                />
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