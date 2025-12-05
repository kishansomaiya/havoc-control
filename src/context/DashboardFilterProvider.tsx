import { isEqual, isNil, isNull } from 'lodash';
import {
    createContext,
    FC,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    DASHBOARD_FILTER_BASE_INFO_PROP_NAMES,
    useResultSetValuesQuery,
} from '../api/queries/resultSetsQuery';
import { Scenario } from '../types';

const DEAULT_FILTER_CONTEXT: IDashboardFilterContext = {
    filterData: {
        countryCodeISO2A: [],
        admin1Code: [],
        occupancyName: [],
        entity: [],
    },
    filterLists: {},
    isResultSetLoading: false,
    isResultSetFiltersLoading: false,
    isFiltersDisabled: false,
};

interface IDashboardFilterOption {
    name: string;
    value: string;
    selected: boolean;
}

interface IDashboardFilterValues {
    id: keyof IDashboardFilter;
    values: string[];
}

export interface IDashboardFilter {
    countryCodeISO2A: IDashboardFilterOption[];
    admin1Code: IDashboardFilterOption[];
    occupancyName: IDashboardFilterOption[];
    entity: IDashboardFilterOption[];
}

interface IDashboardFilterLists {
    countryCodeISO2A?: string[];
    admin1Code?: string[];
    occupancyName?: string[];
    entity?: string[];
}

interface IDashboardFilterContext {
    filterData: IDashboardFilter;
    filterLists: IDashboardFilterLists;
    isResultSetLoading: boolean;
    isResultSetFiltersLoading: boolean;
    isFiltersDisabled: boolean;
}

export const DashboardFilterContext = createContext<IDashboardFilterContext>(
    DEAULT_FILTER_CONTEXT
);
export const useDashboardFilterContext = (): IDashboardFilterContext => {
    return useContext<IDashboardFilterContext>(DashboardFilterContext);
};

export const UpdateDashboardFilterContext = createContext<
    (context: IDashboardFilter) => void
>(() => {});
export const useDashboardFilterContextUpdate = () => {
    return useContext<(context: IDashboardFilter) => void>(
        UpdateDashboardFilterContext
    );
};

export const UpdateDashboardResultSetIdContext = createContext<
    (context?: string | null) => void
>(() => {});
export const useDashboardResultSetIdContextUpdate = () => {
    return useContext<(context?: string | null) => void>(
        UpdateDashboardResultSetIdContext
    );
};

export const DashboardFilterContextProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [filterData, setFilterData] = useState<IDashboardFilter>(
        DEAULT_FILTER_CONTEXT.filterData
    );
    const [filterLists, setFilterLists] = useState<IDashboardFilterLists>(
        DEAULT_FILTER_CONTEXT.filterLists
    );
    const [resultSetId, setResultSetId] = useState<string>();
    const [isFiltersDisabled, setIsFiltersDisabled] = useState<boolean>(false);

    const isResultSetLoading = useMemo(() => isNil(resultSetId), [resultSetId]);

    const { resultSetValues, isResultSetValuesLoading: isResultSetFiltersLoading } =
        useResultSetValuesQuery<IDashboardFilterValues[]>({
            resultSetId,
            queryParams: {
                locationIds: [],
                include: DASHBOARD_FILTER_BASE_INFO_PROP_NAMES,
                filters: {
                    scenario: Scenario.SSP585,
                    ...filterLists,
                },
            },
        });

    const handleDashboardFilterContextChanges = useCallback(
        (filter: IDashboardFilter) => {
            setFilterData(filter);
        },
        []
    );

    const handleDashboardResultSetIdContextChanges = useCallback(
        (id?: string | null) => {
            if(isNull(id)){
                setIsFiltersDisabled(true);
                setResultSetId(undefined);
                return
            }
            setResultSetId(id);
            setIsFiltersDisabled(false);
        },
        []
    );

    useEffect(() => {
        if (!resultSetValues.length) {
            return;
        }
        const newFilters = resultSetValues.reduce<IDashboardFilter>(
            (acc, val) => {
                const { id, values } = val;
                if (!filterData[id] || !filterData[id].length) {
                    return {
                        ...acc,
                        [id]: values.map((item) => ({
                            name: item,
                            value: item,
                            selected: false,
                        })),
                    };
                }

                const idFilters = values.map((val) => {
                    const data = filterData[id].find(
                        (item) => item.value === val
                    );
                    return (
                        data ?? {
                            name: val,
                            value: val,
                            selected: false,
                        }
                    );
                });

                return {
                    ...acc,
                    [id]: idFilters,
                };
            },
            {} as IDashboardFilter
        );

        if (isEqual(newFilters, filterData)) {
            return;
        }

        // setFilterData({...DEAULT_FILTER_CONTEXT.filterData, ...newFilters});
        setFilterData(newFilters);
    }, [resultSetValues]);

    useEffect(() => {
        const listsFromData = Object.fromEntries(
            Object.entries(filterData)
                .map<[key: string, value: string[]]>(
                    ([key, value]: [
                        key: string,
                        value: IDashboardFilterOption[],
                    ]) => [
                        key,
                        value
                            .filter((val) => val.selected)
                            .map((val) => val.value),
                    ]
                )
                .filter(
                    ([_key, value]: [key: string, value: string[]]) =>
                        value.length > 0
                )
        );
        // .reduce<IDashboardFilterLists>(
        //     (acc, curr: [key: string, value: IDashboardFilterOption[]]) => {
        //         const [key, value] = curr;
        //         const valueList = value.map((val) => )
        //         return acc;
        //     },
        //     { ...DEAULT_FILTER_CONTEXT.filterLists }
        // );

        if (isEqual(listsFromData, filterLists)) {
            return;
        }
        setFilterLists(listsFromData);
    }, [filterData]);

    return (
        <DashboardFilterContext.Provider
            value={{ filterData, filterLists, isResultSetLoading, isResultSetFiltersLoading, isFiltersDisabled }}
        >
            <UpdateDashboardFilterContext.Provider
                value={handleDashboardFilterContextChanges}
            >
                <UpdateDashboardResultSetIdContext.Provider
                    value={handleDashboardResultSetIdContextChanges}
                >
                    {children}
                </UpdateDashboardResultSetIdContext.Provider>
            </UpdateDashboardFilterContext.Provider>
        </DashboardFilterContext.Provider>
    );
};
