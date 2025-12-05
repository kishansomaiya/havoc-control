import { Box, Button, ButtonGroup, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useParams } from 'react-router';
import {
    PerilsOptions,
    ResultSetType,
} from '../../../api/openapi/auto-generated';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    LocationDamageAndLossFiltersForm,
    LocationDamageAndLossFilterValues,
} from './components/LocationDamageAndLossFiltersForm';
import { useSearchParams } from 'react-router-dom';
import {
    LOCATION_IMPACT_METRIC_LABEL,
    RESULT_SET_DEFAULT_YEAR_FROM,
    RESULT_SET_MIN_YEAR_FROM,
} from '../../../const';
import {
    ImpactType,
    LocationDamageAndLossData,
    LocationImpactMetric,
    LossType,
    Scenario,
} from '../../../types';
import { useImpactTypeOptions } from '../../../hooks/useImpactTypeOptions';
import { LocationImpactMetricComparison } from './components/LocationImpactMetricComparison';
import { useGetLocationDamageAndLossDataQuery } from '../../../api/queries/resultSetsQuery';
import { LocationDamageAndLossGraph } from './components/LocationDamageAndLossGraph';
import {
    getLocationCurrencyCode,
    getLocationImpactValue,
} from '../../../utils';
import { usePortfolioResultSetData } from '../../../hooks/usePortfolioResultSetData';
import { TabLoadingIndicator } from '../../../components/Tab/TabLoadingIndicator';
import { TabDataNotAvailableMessage } from '../../../components/Tab/TabDataNotAvailableMessage';

const toggleButtonStyle = { minWidth: '5rem' };

export const LocationDamageAndLossTab = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        resultSet,
        isResultSetLoading,
        isResultSetError,
        resultSetOptions,
    } = usePortfolioResultSetData<PerilsOptions>(ResultSetType.damages);

    const { locationId } = useParams();
    const [impactType, setImpactType] = useState<ImpactType>(ImpactType.Damage);

    const impactTypeOptions = useImpactTypeOptions();

    const handleLocationFiltersChange = useCallback(
        (values: LocationDamageAndLossFilterValues) => {
            const params = new URLSearchParams();
            Object.keys(values).forEach((key) => {
                const value =
                    values[key as keyof LocationDamageAndLossFilterValues];
                params.append(key, value.toString());
            });

            params.append('impactType', impactType);

            if (searchParams.toString() === params.toString()) {
                return;
            }

            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams, impactType]
    );

    const filtersFormValuesFromUrlSearchParams = useMemo(() => {
        const yearToParam: string | null = searchParams.get('yearTo');
        const yearTo: '' | number = !yearToParam
            ? ''
            : (parseInt(yearToParam) as number);
        return {
            yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
            yearTo,
            scenario: searchParams.get('scenario') as Scenario | '',
            lossType: (searchParams.get('lossType') ||
                LossType.Total) as LossType,
        };
    }, [searchParams]);

    const resultSetOptionsYears = useMemo(
        () => resultSetOptions?.years ?? [],
        [resultSetOptions]
    );

    const {
        locationDamageAndLossData,
        isLocationDamageAndLossDataLoading,
        isLocationDamageAndLossDataError,
    } = useGetLocationDamageAndLossDataQuery({
        resultSetId: resultSet?.id,
        locationId,
        years: resultSetOptionsYears,
        scenario: filtersFormValuesFromUrlSearchParams.scenario,
    });

    const { yearFrom, yearTo, lossType } = filtersFormValuesFromUrlSearchParams;

    useEffect(() => {
        const impactTypeUrlSearchParam = searchParams.get('impactType');
        if (!impactTypeUrlSearchParam) {
            return;
        }
        setImpactType(impactTypeUrlSearchParam as ImpactType);
    }, [searchParams, setImpactType]);

    const impactDataFrom = useMemo(() => {
        return (
            locationDamageAndLossData.find(
                ({ year }) => year?.toString() === yearFrom.toString()
            ) || new LocationDamageAndLossData()
        );
    }, [locationDamageAndLossData, yearFrom]);

    const impactDataTo = useMemo(() => {
        return (
            locationDamageAndLossData.find(
                ({ year }) => year?.toString() === yearTo.toString()
            ) || new LocationDamageAndLossData()
        );
    }, [locationDamageAndLossData, yearTo]);

    const graphYearRange = useMemo(() => {
        return (resultSetOptions?.years || []).filter(
            (year) => year >= RESULT_SET_MIN_YEAR_FROM
        );
    }, [resultSetOptions]);

    const graphData = useMemo(() => {
        return Object.values(LocationImpactMetric).map((metric) => {
            return {
                id: metric as LocationImpactMetric,
                legend: LOCATION_IMPACT_METRIC_LABEL[metric],
                data: graphYearRange.map((graphYear) => {
                    if (!lossType) {
                        return 0;
                    }
                    const locationDamageAndLossDataAtYear =
                        locationDamageAndLossData.find(
                            ({ year }) =>
                                year?.toString() === graphYear.toString()
                        ) || new LocationDamageAndLossData();
                    return (
                        getLocationImpactValue(
                            impactType,
                            metric,
                            lossType,
                            locationDamageAndLossDataAtYear
                        ) || 0
                    );
                }),
            };
        });
    }, [graphYearRange, impactType, lossType, locationDamageAndLossData]);

    const showLoadingIndicator = useMemo(() => {
        return isResultSetLoading || isLocationDamageAndLossDataLoading;
    }, [isResultSetLoading, isLocationDamageAndLossDataLoading]);

    const showDataLoadingErrorMessage = useMemo(() => {
        return (
            !isResultSetLoading &&
            !isLocationDamageAndLossDataLoading &&
            (isResultSetError || isLocationDamageAndLossDataError || !resultSet)
        );
    }, [
        isResultSetLoading,
        isLocationDamageAndLossDataLoading,
        isResultSetError,
        isLocationDamageAndLossDataError,
        resultSet,
    ]);

    const currencyCode = useMemo(
        () => getLocationCurrencyCode(locationDamageAndLossData[0]) ?? '',
        [locationDamageAndLossData]
    );

    return (
        <Box
            display="flex"
            height="100%"
            flexDirection="column"
            position="relative"
            overflow="auto"
            data-testid="slp-damage-loss-body"
        >
            {!showDataLoadingErrorMessage && (
                <>
                    <Box>
                        <Grid container>
                            <Grid
                                xs={6}
                                px={4}
                                py={2}
                            >
                                <ButtonGroup
                                    variant="outlined"
                                    size="small"
                                    data-testid="slp-damage-loss-buttons"
                                >
                                    {impactTypeOptions.map(
                                        (impactTypeOption) => (
                                            <Button
                                                data-testid="slp-damage-loss-button"
                                                key={impactTypeOption.id}
                                                variant={
                                                    impactTypeOption.id ===
                                                        impactType
                                                        ? 'contained'
                                                        : undefined
                                                }
                                                onClick={() =>
                                                    setImpactType(
                                                        impactTypeOption.id
                                                    )
                                                }
                                            >
                                                <span style={toggleButtonStyle}>
                                                    {impactTypeOption.title}
                                                </span>
                                            </Button>
                                        )
                                    )}
                                </ButtonGroup>
                            </Grid>
                            <Grid xs={0}>
                                <Divider orientation="vertical" />
                            </Grid>
                            <Grid
                                xs={6}
                                px={4}
                                py={2}
                            >
                                {resultSetOptions && (
                                    <LocationDamageAndLossFiltersForm
                                        data-testid="slp-damage-loss-filters-form"
                                        resultSetOptions={resultSetOptions}
                                        onFiltersChange={
                                            handleLocationFiltersChange
                                        }
                                        urlFilterParams={
                                            filtersFormValuesFromUrlSearchParams
                                        }
                                        impactType={impactType}
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
                        {yearTo && impactDataFrom && impactDataTo && (
                            <LocationImpactMetricComparison
                                impactType={impactType}
                                yearFrom={yearFrom}
                                yearTo={yearTo}
                                lossType={lossType}
                                impactDataFrom={impactDataFrom}
                                impactDataTo={impactDataTo}
                            />
                        )}
                    </Box>
                    <Divider />
                    <Box
                        flexGrow={1}
                        px={4}
                        pt={3}
                        pb={1}
                    >
                        <LocationDamageAndLossGraph
                            yearsRange={graphYearRange}
                            graphData={graphData}
                            impactType={impactType}
                            lossType={lossType}
                            currencyCode={currencyCode}
                        />
                    </Box>
                </>
            )}

            {showLoadingIndicator && <TabLoadingIndicator />}

            {showDataLoadingErrorMessage && <TabDataNotAvailableMessage />}
        </Box>
    );
};
