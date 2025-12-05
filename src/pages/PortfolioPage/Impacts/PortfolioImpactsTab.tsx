import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { DataNotAvailableModal } from '../../../components/DataNotAvailableModal/DataNotAvailableModal';
import { usePortfolioImpactsData } from '../../../hooks/usePortfolioImpactsData';
import { RESULT_SET_MIN_YEAR_FROM } from '../../../const';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';
import { ImpactsFiltersForm } from './components/ImpactsFiltersForm';
import { ImpactsMetrics } from './components/ImpactsMetrics';
import { usePortfolioImpactsDataQuery } from '../../../api/queries/resultSetsQuery';
import { ImpactsByLocationTable } from './components/ImpactsByLocationTable';
import { ImpactsOverTimeChart } from './components/ImpactsOverTimeChart';
import { IPortfolioItem, LocationFinancialMetric } from '../../../types';
import { useOutletContext } from 'react-router';
import { getDefaultPortfolioPageUrl } from '../../../utils';
import {
    useDashboardFilterContext,
    useDashboardResultSetIdContextUpdate,
} from '../../../context/DashboardFilterProvider';

const CHART_CONFIG = [
    {
        title: 'Average Annual Loss over Time',
        metrics: [
            LocationFinancialMetric.AverageAnnualLossFlood,
            LocationFinancialMetric.AverageAnnualLossWind,
            LocationFinancialMetric.AverageAnnualLossHeat,
            LocationFinancialMetric.AverageAnnualLossWildfire,
            LocationFinancialMetric.AverageAnnualLossDrought,
        ],
        isBarChart: true,
    },
    {
        title: 'Portfolio Value at Risk (Wind+Flood)',
        metrics: [
            LocationFinancialMetric.ProbabilityValueAtRiskWith20YearsReturnPeriod,
            LocationFinancialMetric.ProbabilityValueAtRiskWith100YearsReturnPeriod,
        ],
        isBarChart: false,
        isFinancials: true,
    },
    {
        title: 'Climate Adjusted Valuation Over Time',
        metrics: [
            LocationFinancialMetric.BenchmarkAssetValue,
            LocationFinancialMetric.ClimateAdjustedAssetValue,
        ],
        isBarChart: false,
    },
    {
        title: 'Technical premium Over Time',
        metrics: [LocationFinancialMetric.TechnicalPremium],
        isBarChart: true,
    },
    {
        title: 'Transmission Channel Impacts Over Time',
        metrics: [
            LocationFinancialMetric.CapitalExpenditures,
            LocationFinancialMetric.OperationalRevenue,
            LocationFinancialMetric.OperationalExpenses,
        ],
        isBarChart: false,
        isLineWithArea: true,
        useGradient: true,
    },
];

export const PortfolioImpactsTab = () => {
    const [isDataNotAvailableModalOpen, setIsDataNotAvailableModalOpen] =
        useState(false);
    const { portfolioItem } = useOutletContext<{
        portfolioItem: IPortfolioItem;
    }>();

    const {
        impactsFiltersFormValuesFromUrlSearchParams,
        perilsResultSet,
        eiResultSet,
        portfolioFinancialResultSet,
        yearFrom,
        yearTo,
        scenario,
        isResultSetLoading,
        portfolioId,
        resultSetOptions,
        handleFiltersChange,
        isResultSetError,
    } = usePortfolioImpactsData();

    const years = useMemo(
        () =>
            (resultSetOptions?.years || []).filter(
                (year) => year >= RESULT_SET_MIN_YEAR_FROM
            ),
        [resultSetOptions]
    );

    const { filterLists } = useDashboardFilterContext();
    const updateDashboardFilterResultSetId =
        useDashboardResultSetIdContextUpdate();
    const {
        portfolioImpactsData,
        isPortfolioImpactsDataLoading,
        isPortfolioImpactsDataError,
    } = usePortfolioImpactsDataQuery({
        scenario,
        resultSetId: perilsResultSet?.id,
        years,
        filters: filterLists as Record<string, string[]>,
    });

    const {
        portfolioImpactsData: portfolioImpactsFinancialData,
        isPortfolioImpactsDataLoading: isPortfolioImpactsFinancialDataLoading,
    } = usePortfolioImpactsDataQuery({
        scenario: impactsFiltersFormValuesFromUrlSearchParams.scenario,
        resultSetId: portfolioFinancialResultSet?.id,
        years,
        filters: filterLists as Record<string, string[]>,
    });

    const showLoadingIndicator = useMemo(
        () =>
            isResultSetLoading ||
            isPortfolioImpactsDataLoading ||
            isPortfolioImpactsFinancialDataLoading,
        [
            isResultSetLoading,
            isPortfolioImpactsDataLoading,
            isPortfolioImpactsFinancialDataLoading,
        ]
    );

    const showDataLoadingErrorMessage = useMemo(
        () =>
            !isResultSetLoading &&
            !isPortfolioImpactsDataLoading &&
            !isPortfolioImpactsFinancialDataLoading &&
            (isResultSetError || isPortfolioImpactsDataError),
        [
            isResultSetLoading,
            isPortfolioImpactsDataLoading,
            isPortfolioImpactsFinancialDataLoading,
            isResultSetError,
            isPortfolioImpactsDataError,
        ]
    );

    useEffect(() => {
        if (!isResultSetLoading && !eiResultSet) {
            setIsDataNotAvailableModalOpen(true);
        }
    }, [eiResultSet, isResultSetLoading]);

    useEffect(() => {
        updateDashboardFilterResultSetId(eiResultSet?.id);
    }, [eiResultSet, updateDashboardFilterResultSetId]);

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
            {!isResultSetLoading && (
                <Box
                    display="flex"
                    flexDirection="column"
                    data-testid="portfolio-impacts-body"
                >
                    {!!resultSetOptions && (
                        <>
                            <ImpactsFiltersForm
                                urlFilterParams={
                                    impactsFiltersFormValuesFromUrlSearchParams
                                }
                                resultSetOptions={resultSetOptions}
                                onFiltersChange={handleFiltersChange}
                                data-testid="impacts-filters-form"
                            />
                            <Divider />
                        </>
                    )}
                    {yearTo && portfolioImpactsData && (
                        <>
                            <ImpactsMetrics
                                impactsData={portfolioImpactsData}
                                yearTo={yearTo}
                                yearFrom={yearFrom}
                            />
                            <Divider />
                        </>
                    )}

                    {portfolioImpactsData && (
                        <Grid
                            container
                            sx={(theme) => ({
                                '& > div': {
                                    borderRight: '1px solid',
                                    borderBottom: '1px solid',
                                    borderColor: theme.palette.grey['500'],
                                    [`&:nth-of-type(2n)`]: {
                                        borderRight: 'none',
                                    },
                                },
                            })}
                            data-testid="charts"
                        >
                            {CHART_CONFIG.map(({ isFinancials, ...config }) => (
                                <ImpactsOverTimeChart
                                    key={config.title}
                                    {...config}
                                    impactsData={
                                        isFinancials
                                            ? portfolioImpactsFinancialData
                                            : portfolioImpactsData
                                    }
                                    yearsRange={years}
                                />
                            ))}

                            {portfolioId && yearTo && (
                                <ImpactsByLocationTable
                                    portfolioId={portfolioId}
                                    impactsData={portfolioImpactsData}
                                    yearTo={yearTo}
                                    yearFrom={yearFrom}
                                    scenario={scenario}
                                    data-testid="impacts-location-table-section"
                                />
                            )}
                        </Grid>
                    )}
                </Box>
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
