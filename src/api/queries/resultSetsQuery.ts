import { useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import {
    EUHazardMetadata,
    ResultSetDataQueryParams,
    ResultSetDataSchema,
    ResultSetType,
} from '../openapi/auto-generated';
import {
    BenchmarkLevel,
    GLOBAL_BENCHMARK_LEVEL,
    LocationDamageAndLossData,
    Scenario,
    Score,
    ScoreLevel,
} from '../../types';
import { useMemo } from 'react';
import {
    LocationFinancialMetricsData,
    PortfolioImpactsLocationData,
} from '../../types';
import { getPortfolioScoringPropNames } from '../../utils';

const LOCATION_BASE_INFO_PROP_NAMES = [
    'locationId',
    'latitude',
    'longitude',
    'locationName',
];

export const DASHBOARD_FILTER_BASE_INFO_PROP_NAMES = [
    'countryCodeISO2A',
    'admin1Code',
    'occupancyName',
    'entity',
];

export const useResultSetsQuery = (
    params: {
        portfolio?: string;
        type?: ResultSetType;
        limit?: number;
        startingAfter?: string;
    } = {}
) => {
    const { resultSetsApi } = useApi();
    const {
        data,
        isLoading: isResultSetsLoading,
        isError: isResultSetsError,
        refetch: refetchResultSets,
    } = useQuery({
        queryKey: ['resultSets', params.portfolio, params.type],
        queryFn: ({ signal }) => {
            return resultSetsApi.listResultSetsResultSetsGet(params, {
                signal,
            });
        },
    });

    const resultSets = useMemo(() => data?.data || [], [data]);

    return {
        resultSets,
        isResultSetsLoading,
        isResultSetsError,
        refetchResultSets,
    };
};

export const useResultSetQuery = (params: { resultSetId?: string }) => {
    const { resultSetsApi } = useApi();
    const { resultSetId } = params;
    const enabled = !!resultSetId;
    const {
        data,
        isLoading: isResultSetLoading,
        isError: isResultSetError,
    } = useQuery({
        queryKey: ['resultSets', resultSetId],
        queryFn: ({ signal }) => {
            if (!enabled) {
                return;
            }
            return resultSetsApi.retrieveResultSetResultSetsResultSetIdGet(
                { resultSetId },
                {
                    signal,
                }
            );
        },
        enabled,
    });

    return {
        resultSet: data,
        isResultSetLoading,
        isResultSetError,
    };
};

export const useResultSetValuesQuery = <T>(
    params: {
        resultSetId?: string;
        queryParams?: ResultSetDataQueryParams;
    } = {}
) => {
    const { newResultSetsApi } = useApi();
    const defaultQueryParams = {
        locationIds: [],
        include: DASHBOARD_FILTER_BASE_INFO_PROP_NAMES,
        filters: {},
    };
    const { resultSetId = '', queryParams = defaultQueryParams } = params;
    const {
        data,
        isLoading: isResultSetValuesLoading,
        isError: isResultSetValuesError,
        error: resultSetValuesLoadingError,
    } = useQuery({
        queryKey: ['resultSetValues', resultSetId, queryParams],
        queryFn: ({ signal }) => {
            if (!resultSetId) {
                return;
            }
            return newResultSetsApi.retrieveResultDataResultSetsResultSetIdValuePost(
                {
                    resultSetId,
                    resultSetDataQueryParams: queryParams,
                },
                {
                    signal,
                }
            );
        },
        enabled: !!resultSetId,
    });

    const resultSetValues = useMemo(() => (data?.values || []) as T, [data]);

    return {
        resultSetValues,
        isResultSetValuesLoading,
        isResultSetValuesError,
        resultSetValuesLoadingError,
    };
};

export const useResultSetDataQuery = <T>(
    params: {
        resultSetId?: string;
        queryParams?: ResultSetDataQueryParams;
    } = {}
) => {
    const { resultSetsApi } = useApi();
    const defaultQueryParams = {
        locationIds: [],
        include: LOCATION_BASE_INFO_PROP_NAMES,
        filters: {
            scenario: 'ssp585',
        },
    };
    const { resultSetId = '', queryParams = defaultQueryParams } = params;
    const {
        data,
        isLoading: isResultSetDataLoading,
        isError: isResultSetDataError,
        error: resultSetDataLoadingError,
    } = useQuery({
        queryKey: ['resultSetData', resultSetId, queryParams],
        queryFn: ({ signal }) => {
            if (!resultSetId) {
                return;
            }
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId,
                    resultSetDataQueryParams: queryParams,
                },
                {
                    signal,
                }
            );
        },
        enabled: !!resultSetId,
    });

    const resultSetData = useMemo(() => (data?.data || []) as T, [data]);

    return {
        resultSetData,
        isResultSetDataLoading,
        isResultSetDataError,
        resultSetDataLoadingError,
    };
};

export const useResultSetSchemaQuery = (
    params: {
        resultSetId?: string;
    } = {}
) => {
    const { resultSetsApi } = useApi();
    const { resultSetId = '' } = params;
    const {
        data,
        isLoading: isResultSetSchemaLoading,
        isError: isResultSetSchemaError,
        error: resultSetSchemaLoadingError,
    } = useQuery({
        queryKey: ['ResultSetSchema', resultSetId],
        queryFn: ({ signal }) => {
            return resultSetsApi.retrieveResultSchemaResultSetsResultSetIdSchemaGet(
                {
                    resultSetId,
                },
                {
                    signal,
                }
            );
        },
        enabled: !!resultSetId,
    });

    const resultSetSchema = useMemo(
        () => (data?.dataSchema || []) as Array<ResultSetDataSchema>,
        [data]
    );

    return {
        resultSetSchema,
        isResultSetSchemaLoading,
        isResultSetSchemaError,
        resultSetSchemaLoadingError,
    };
};

export const useResultSetMetadataQuery = (
    params: {
        resultSetId?: string;
    } = {}
) => {
    const { resultSetsApi } = useApi();
    const { resultSetId = '' } = params;
    const {
        data,
        isLoading: isResultSetMetadataLoading,
        isError: isResultSetMetadataError,
        error: resultSetMetadataLoadingError,
    } = useQuery({
        queryKey: ['ResultSetMetadata', resultSetId],
        queryFn: ({ signal }) => {
            return resultSetsApi.retrieveResultSetMetadataResultSetsResultSetIdMetadataGet(
                {
                    resultSetId,
                },
                {
                    signal,
                }
            );
        },
        enabled: !!resultSetId,
    });

    const resultSetMetadata: { [key: string]: EUHazardMetadata } = useMemo(
        () => data?.metadata?.euHazardMetadata || {},
        [data]
    );

    return {
        resultSetMetadata,
        isResultSetMetadataLoading,
        isResultSetMetadataError,
        resultSetMetadataLoadingError,
    };
};

interface PortfolioHazardDataQueryParams {
    resultSetId?: string;
    scenario?: Scenario;
    peril?: Score;
    yearFrom?: number;
    yearTo?: number | '';
    metric?: string;
    filters?: Record<string, string[]>;
}

export interface LocationHazardData {
    latitude: number;
    longitude: number;
    locationId: number;
    locationName: string | null;
    mean: number;
    tier: ScoreLevel;
    year: number;
}

export const usePortfolioHazardDataQuery = (
    params: PortfolioHazardDataQueryParams = {}
) => {
    const { resultSetsApi } = useApi();
    const {
        resultSetId = '',
        scenario,
        peril,
        yearFrom,
        yearTo,
        metric,
        filters = {},
    } = params;
    const enabled =
        !!resultSetId &&
        !!scenario &&
        !!peril &&
        !!yearFrom &&
        !!yearTo &&
        !!metric;
    const metricMeanParamName = metric || '';
    const metricTierParamName = metricMeanParamName.replace('mean', 'tier');
    const {
        data,
        isLoading: isPortfolioHazardDataLoading,
        isError: isPortfolioHazardDataError,
        isFetched: isPortfolioHazardDataFetched,
        error: portfolioHazardDataLoadingError,
    } = useQuery({
        queryKey: ['portfolioResultSetData', params],
        queryFn: ({ signal }) => {
            if (!enabled) {
                return;
            }
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId,
                    resultSetDataQueryParams: {
                        locationIds: [],
                        include: [
                            metricMeanParamName,
                            metricTierParamName,
                            ...LOCATION_BASE_INFO_PROP_NAMES,
                            'year',
                        ],
                        filters: {
                            scenario: scenario,
                            peril: peril,
                            year: [yearFrom.toString(), yearTo.toString()],
                            ...filters,
                        },
                    },
                },
                {
                    signal,
                }
            );
        },
        enabled,
    });

    const portfolioHazardData = useMemo(
        () =>
            (data?.data || []).map(
                (locationData: { [key: string]: string | number }) => {
                    const {
                        [metricMeanParamName]: mean,
                        [metricTierParamName]: tier,
                        ...rest
                    } = locationData;
                    return {
                        ...rest,
                        mean,
                        tier,
                    };
                }
            ) as LocationHazardData[],
        [data, metricMeanParamName, metricTierParamName]
    );

    return {
        portfolioHazardData,
        isPortfolioHazardDataLoading,
        isPortfolioHazardDataError,
        isPortfolioHazardDataFetched,
        portfolioHazardDataLoadingError,
    };
};

interface LocationsHazardDataQueryParams {
    resultSetId?: string;
    locationId?: number | string;
    peril?: Score;
    years: number[];
    metricIds: string[];
    scenario?: Scenario;
}

export const useGetLocationHazardDataQuery = (
    params: LocationsHazardDataQueryParams
) => {
    const { resultSetId, locationId, peril, years, metricIds, scenario } =
        params;
    const { resultSetsApi } = useApi();
    const {
        data,
        isLoading: isLocationHazardDataLoading,
        isError: isLocationHazardDataError,
        error: locationHazardDataLoadingError,
    } = useQuery({
        queryKey: ['portfolioResultSetData', params],
        queryFn: ({ signal }) => {
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId: resultSetId as string,
                    resultSetDataQueryParams: {
                        locationIds: [Number(locationId)],
                        include: ['locationId', 'year', ...metricIds],
                        filters: {
                            scenario: scenario as Scenario,
                            peril: peril as Score,
                            year: years,
                        },
                    },
                },
                {
                    signal,
                }
            );
        },
        enabled:
            !!resultSetId &&
            (!!locationId || locationId === 0) &&
            !!peril &&
            years.length > 0 &&
            metricIds.length > 0 &&
            !!scenario,
    });
    return {
        locationHazardData: data?.data || [],
        isLocationHazardDataLoading,
        isLocationHazardDataError,
        locationHazardDataLoadingError,
    };
};

interface LocationDamageAndLossDataQueryParams {
    resultSetId?: string;
    locationId?: number | string;
    years: number[];
    scenario?: Scenario | '';
}

export const useGetLocationDamageAndLossDataQuery = (
    params: LocationDamageAndLossDataQueryParams
) => {
    const { resultSetId, locationId, years, scenario } = params;
    const { resultSetsApi } = useApi();
    const locationDamageAndLossDataPropNames = Object.keys(
        new LocationDamageAndLossData()
    );
    const {
        data,
        isLoading: isLocationDamageAndLossDataLoading,
        isError: isLocationDamageAndLossDataError,
        error: locationDamageAndLossDataLoadingError,
    } = useQuery({
        queryKey: ['portfolioResultSetData', params],
        queryFn: ({ signal }) => {
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId: resultSetId as string,
                    resultSetDataQueryParams: {
                        locationIds: [Number(locationId)],
                        include: locationDamageAndLossDataPropNames,
                        filters: {
                            scenario: scenario as Scenario,
                            year: years,
                        },
                    },
                },
                {
                    signal,
                }
            );
        },
        enabled:
            !!resultSetId && !!locationId && years.length > 0 && !!scenario,
    });

    return {
        locationDamageAndLossData: (data?.data ||
            []) as LocationDamageAndLossData[],
        isLocationDamageAndLossDataLoading,
        isLocationDamageAndLossDataError,
        locationDamageAndLossDataLoadingError,
    };
};

interface LocationFinancialMetricsDataQueryParams {
    resultSetId?: string;
    locationId?: number | string;
    years: number[];
    scenario?: Scenario | '';
}

export const useGetLocationFinancialMetricsDataQuery = (
    params: LocationFinancialMetricsDataQueryParams
) => {
    const { resultSetId, locationId, years, scenario } = params;
    const { resultSetsApi } = useApi();
    const locationFinancialMetricsDataPropNames = Object.keys(
        new LocationFinancialMetricsData()
    );
    const {
        data,
        isLoading: isLocationFinancialMetricsDataLoading,
        isError: isLocationFinancialMetricsDataError,
        error: locationFinancialMetricsDataLoadingError,
    } = useQuery({
        queryKey: ['portfolioResultSetData', params],
        queryFn: ({ signal }) => {
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId: resultSetId as string,
                    resultSetDataQueryParams: {
                        locationIds: [Number(locationId)],
                        include: locationFinancialMetricsDataPropNames,
                        filters: {
                            scenario: scenario as Scenario,
                            year: years,
                        },
                    },
                },
                {
                    signal,
                }
            );
        },
        enabled:
            !!resultSetId && !!locationId && years.length > 0 && !!scenario,
    });

    return {
        locationFinancialMetricsData: (data?.data ||
            []) as LocationFinancialMetricsData[],
        isLocationFinancialMetricsDataLoading,
        isLocationFinancialMetricsDataError,
        locationFinancialMetricsDataLoadingError,
    };
};

interface PortfolioImpactsDataQueryParams {
    resultSetId?: string;
    scenario?: Scenario;
    years?: number[];
    filters?: Record<string, string[]>;
}

export const usePortfolioImpactsDataQuery = (
    params: PortfolioImpactsDataQueryParams = {}
) => {
    const { resultSetsApi } = useApi();
    const { resultSetId = '', scenario, years, filters = {} } = params;

    const {
        data,
        isLoading: isPortfolioImpactsDataLoading,
        isError: isPortfolioImpactsDataError,
        error: portfolioImpactsDataLoadingError,
    } = useQuery({
        queryKey: ['portfolioResultSetData', params],
        queryFn: ({ signal }) => {
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId,
                    resultSetDataQueryParams: {
                        locationIds: [],
                        include: Object.keys(
                            new PortfolioImpactsLocationData()
                        ),
                        filters: {
                            scenario: scenario as string,
                            year: years || [],
                            ...filters,
                        },
                    },
                },
                {
                    signal,
                }
            );
        },
        enabled: !!resultSetId && !!scenario,
    });

    const portfolioImpactsData: PortfolioImpactsLocationData[] = useMemo(
        () => data?.data || [],
        [data]
    );

    return {
        portfolioImpactsData,
        isPortfolioImpactsDataLoading,
        isPortfolioImpactsDataError,
        portfolioImpactsDataLoadingError,
    };
};

interface PortfolioScoringDataQueryParams {
    resultSetId?: string;
    benchmarkLevel: BenchmarkLevel | typeof GLOBAL_BENCHMARK_LEVEL;
    score?: Score | '';
    filters?: Record<string, string[]>;
}

export interface LocationScoringData {
    latitude: number;
    longitude: number;
    locationId: number;
    locationName: string | null;
    changeScoreValue: number;
    overallScoreValue: number;
    hazardScoreValue: number;
}

export const usePortfolioScoringDataQuery = (
    params: PortfolioScoringDataQueryParams
) => {
    const { resultSetsApi } = useApi();
    const {
        resultSetId = '',
        benchmarkLevel = GLOBAL_BENCHMARK_LEVEL,
        score,
        filters = {},
    } = params;

    const propNames = getPortfolioScoringPropNames({
        benchmarkLevel,
        score: score || undefined,
    });

    const {
        data,
        isLoading: isPortfolioScoringDataLoading,
        isError: isPortfolioScoringDataError,
        error: portfolioScoringDataLoadingError,
    } = useQuery({
        enabled: !!score && !!resultSetId,
        queryKey: ['portfolioResultSetData', params],
        queryFn: ({ signal }) => {
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId,
                    resultSetDataQueryParams: {
                        locationIds: [],
                        include: [
                            ...Object.values(propNames),
                            ...LOCATION_BASE_INFO_PROP_NAMES,
                        ],
                        filters,
                    },
                },
                { signal }
            );
        },
    });

    const portfolioScoringData = useMemo(() => {
        return (data?.data || []).map(
            (
                locationData: Record<string, Record<number, number | undefined>>
            ) => {
                const { latitude, longitude, locationId, locationName } =
                    locationData;
                return {
                    latitude,
                    longitude,
                    locationId,
                    locationName,
                    changeScoreValue:
                        locationData[propNames.changePropName] ?? 0,
                    overallScoreValue:
                        locationData[propNames.overallPropName] ?? 0,
                    hazardScoreValue:
                        locationData[propNames.hazardPropName] ?? 0,
                };
            }
        ) as LocationScoringData[];
    }, [
        data,
        propNames.changePropName,
        propNames.hazardPropName,
        propNames.overallPropName,
    ]);

    return {
        portfolioScoringData,
        isPortfolioScoringDataLoading,
        isPortfolioScoringDataError,
        portfolioScoringDataLoadingError,
    };
};

interface PortfolioFloodMeshDataQueryParams {
    resultSetId?: string;
    locationId?: string;
    scenario?: Scenario | '';
    yearFrom?: number;
    yearTo?: number | '';
    metric?: string;
}

export interface LocationFloodMeshData {
    latitude: number;
    longitude: number;
    locationId: number;
    locationName: string | null;
    mean: number;
    tier: ScoreLevel;
    year: number;
}

export const usePortfolioFloodMeshDataQuery = (
    params: PortfolioFloodMeshDataQueryParams = {}
) => {
    const { resultSetsApi } = useApi();
    const {
        resultSetId = '',
        locationId,
        scenario,
        yearFrom,
        yearTo,
        metric,
    } = params;
    const enabled =
        !!resultSetId &&
        !!locationId &&
        !!scenario &&
        !!yearFrom &&
        !!yearTo &&
        !!metric;
    const metricMeanParamName = metric || '';
    const metricTierParamName = metricMeanParamName.replace('mean', 'tier');
    const {
        data,
        isLoading: isPortfolioFloodMeshDataLoading,
        isError: isPortfolioFloodMeshDataError,
        isFetched: isPortfolioFloodMeshDataFetched,
        error: portfolioFloodMeshDataLoadingError,
    } = useQuery({
        queryKey: ['portfolioResultSetData', params],
        queryFn: ({ signal }) => {
            if (!enabled) {
                return;
            }
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId,
                    resultSetDataQueryParams: {
                        locationIds: [+locationId],
                        include: [
                            metricMeanParamName,
                            metricTierParamName,
                            ...LOCATION_BASE_INFO_PROP_NAMES,
                            'year',
                        ],
                        filters: {
                            scenario: scenario,
                            year: [yearFrom.toString(), yearTo.toString()],
                        },
                    },
                },
                {
                    signal,
                }
            );
        },
        enabled,
    });

    const portfolioFloodMeshData = useMemo(
        () =>
            (data?.data || []).map(
                (locationData: { [key: string]: string | number }) => {
                    const {
                        [metricMeanParamName]: mean,
                        [metricTierParamName]: tier,
                        ...rest
                    } = locationData;
                    return {
                        ...rest,
                        mean,
                        tier,
                    };
                }
            ) as LocationFloodMeshData[],
        [data, metricMeanParamName, metricTierParamName]
    );

    return {
        portfolioFloodMeshData,
        isPortfolioFloodMeshDataLoading,
        isPortfolioFloodMeshDataError,
        isPortfolioFloodMeshDataFetched,
        portfolioFloodMeshDataLoadingError,
    };
};

interface PortfolioComplianceDataQueryParams {
    resultSetId?: string;
    scenario?: Scenario | '';
    years?: number[];
    filters?: Record<string, string[]>;
    metrics?: string[];
}

export const usePortfolioComplianceDataQuery = (
    params: PortfolioComplianceDataQueryParams = {}
) => {
    const { resultSetsApi } = useApi();
    const { resultSetId = '', scenario, years, filters = {}, metrics } = params;

    const enabled = !!resultSetId && !!scenario && !!years && !!metrics;

    const metricsToInclude = metrics || [];

    const {
        data,
        isLoading: isPortfolioComplianceDataLoading,
        isError: isPortfolioComplianceDataError,
        isFetched: isPortfolioComplianceDataFetched,
        error: portfolioComplianceDataLoadingError,
    } = useQuery({
        queryKey: ['portfolioResultSetData', params],
        queryFn: ({ signal }) => {
            if (!enabled) {
                return;
            }
            return resultSetsApi.retrieveResultDataResultSetsResultSetIdDataPost(
                {
                    resultSetId,
                    resultSetDataQueryParams: {
                        locationIds: [],
                        include: [
                            ...metricsToInclude,
                            ...LOCATION_BASE_INFO_PROP_NAMES,
                            'year',
                        ],
                        filters: {
                            scenario: scenario,
                            year: years,
                            ...filters,
                        },
                    },
                },
                {
                    signal,
                }
            );
        },
        enabled,
    });

    const portfolioComplianceData = useMemo<
        { [key: string]: string | number }[]
    >(() => data?.data || [], [data]);

    return {
        portfolioComplianceData,
        isPortfolioComplianceDataLoading,
        isPortfolioComplianceDataError,
        isPortfolioComplianceDataFetched,
        portfolioComplianceDataLoadingError,
    };
};
