import { Box, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useParams } from 'react-router';
import {
    PerilsOptions,
    ResultSetType,
} from '../../../api/openapi/auto-generated';
import { usePortfolioResultSetData } from '../../../hooks/usePortfolioResultSetData';
import { useGetLocationFinancialMetricsDataQuery } from '../../../api/queries/resultSetsQuery';
import { useCallback, useMemo } from 'react';
import {
    RESULT_SET_DEFAULT_YEAR_FROM,
    RESULT_SET_MIN_YEAR_FROM,
} from '../../../const';
import {
    FinancialMetricViewType,
    Scenario,
    LocationFinancialMetricsData,
} from '../../../types';
import { useSearchParams } from 'react-router-dom';
import {
    LocationFinancialMetricsFiltersForm,
    LocationFinancialMetricsFilterValues,
} from './components/LocationFinancialMetricsFiltersForm';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';
import { LocationFinancialMetricsGraph } from './components/LocationFinancialMetricsGraph';
import { LocationFinancialMetricsComparison } from './components/LocationFinancialMetricsComparison';

export const LocationFinancialMetricsTab = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { locationId } = useParams();
    const {
        resultSet,
        isResultSetLoading,
        isResultSetError,
        resultSetOptions,
    } = usePortfolioResultSetData<PerilsOptions>(ResultSetType.damages);

    const filtersFormValuesFromUrlSearchParams = useMemo(() => {
        const yearToParam: string | null = searchParams.get('yearTo');
        const yearTo: '' | number = !yearToParam
            ? ''
            : (parseInt(yearToParam) as number);
        return {
            yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
            yearTo,
            scenario: searchParams.get('scenario') as Scenario | '',
            viewType:
                (searchParams.get('viewType') as FinancialMetricViewType) ||
                FinancialMetricViewType.TransmissionChannel,
        };
    }, [searchParams]);

    const resultSetOptionsYears = useMemo(
        () => resultSetOptions?.years ?? [],
        [resultSetOptions]
    );

    const {
        locationFinancialMetricsData,
        isLocationFinancialMetricsDataLoading,
        isLocationFinancialMetricsDataError,
    } = useGetLocationFinancialMetricsDataQuery({
        resultSetId: resultSet?.id,
        locationId,
        years: resultSetOptionsYears,
        scenario: filtersFormValuesFromUrlSearchParams.scenario,
    });

    const handleLocationFiltersChange = useCallback(
        (values: LocationFinancialMetricsFilterValues) => {
            const params = new URLSearchParams();
            Object.keys(values).forEach((key) => {
                const value =
                    values[key as keyof LocationFinancialMetricsFilterValues];
                params.append(key, (value || '').toString());
            });

            if (searchParams.toString() === params.toString()) {
                return;
            }

            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const showLoadingIndicator = useMemo(() => {
        return isResultSetLoading || isLocationFinancialMetricsDataLoading;
    }, [isResultSetLoading, isLocationFinancialMetricsDataLoading]);

    const showDataLoadingErrorMessage = useMemo(() => {
        return (
            !isResultSetLoading &&
            !isLocationFinancialMetricsDataLoading &&
            (isResultSetError ||
                isLocationFinancialMetricsDataError ||
                !resultSet)
        );
    }, [
        isResultSetLoading,
        isLocationFinancialMetricsDataLoading,
        isResultSetError,
        isLocationFinancialMetricsDataError,
        resultSet,
    ]);

    const yearFrom = useMemo(
        () => filtersFormValuesFromUrlSearchParams.yearFrom,
        [filtersFormValuesFromUrlSearchParams]
    );

    const yearTo = useMemo(
        () => filtersFormValuesFromUrlSearchParams.yearTo,
        [filtersFormValuesFromUrlSearchParams]
    );

    const viewType = useMemo(
        () => filtersFormValuesFromUrlSearchParams.viewType,
        [filtersFormValuesFromUrlSearchParams]
    );

    const financialDataFrom = useMemo(() => {
        return (
            locationFinancialMetricsData.find(
                ({ year }) => year?.toString() === yearFrom.toString()
            ) || new LocationFinancialMetricsData()
        );
    }, [locationFinancialMetricsData, yearFrom]);

    const financialDataTo = useMemo(() => {
        return (
            locationFinancialMetricsData.find(
                ({ year }) => year?.toString() === yearTo.toString()
            ) || new LocationFinancialMetricsData()
        );
    }, [locationFinancialMetricsData, yearTo]);

    const graphYearRange = useMemo<number[]>(() => {
        return (resultSetOptions?.years || []).filter(
            (year) => year >= RESULT_SET_MIN_YEAR_FROM
        );
    }, [resultSetOptions]);

    const graphFinancialMetrics = useMemo(() => {
        return locationFinancialMetricsData.filter(
            ({ year }) => year && graphYearRange.includes(year)
        );
    }, [locationFinancialMetricsData, graphYearRange]);

    return (
        <Box
            display="flex"
            height="100%"
            flexDirection="column"
            position="relative"
            overflow="auto"
            data-testid="slp-financial-metrics-body"
        >
            {!showDataLoadingErrorMessage && (
                <>
                    <Box>
                        <Grid container>
                            <Grid
                                xs={6}
                                px={4}
                                py={2}
                            />
                            <Grid xs={0}>
                                <Divider orientation="vertical" />
                            </Grid>
                            <Grid
                                xs={6}
                                px={4}
                                py={2}
                            >
                                {resultSetOptions && (
                                    <LocationFinancialMetricsFiltersForm
                                        resultSetOptions={resultSetOptions}
                                        onFiltersChange={
                                            handleLocationFiltersChange
                                        }
                                        urlFilterParams={
                                            filtersFormValuesFromUrlSearchParams
                                        }
                                        data-testid="slp-financial-metrics-filters-form"
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box
                        px={4}
                        py={3}
                        minHeight={'8.55rem'}
                    >
                        {yearTo && (
                            <LocationFinancialMetricsComparison
                                yearFrom={yearFrom}
                                yearTo={yearTo}
                                financialDataFrom={financialDataFrom}
                                financialDataTo={financialDataTo}
                            />
                        )}
                    </Box>
                    <Divider />
                    <Box
                        flexGrow={1}
                        px={4}
                        py={3}
                        data-testid="slp-financial-metrics-graph"
                    >
                        <LocationFinancialMetricsGraph
                            viewType={viewType}
                            yearsRange={graphYearRange}
                            locationFinancialMetrics={graphFinancialMetrics}
                        />
                    </Box>
                </>
            )}

            {showLoadingIndicator && <TabLoadingIndicator />}

            {showDataLoadingErrorMessage && <TabDataNotAvailableMessage />}
        </Box>
    );
};
