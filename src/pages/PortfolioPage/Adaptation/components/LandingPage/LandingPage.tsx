import { Box, Button, Divider, Typography } from '@mui/material';
import { Kpi, KpiViewer } from './KpiViewer';
import { SearchBar } from '../../../../../components/Inputs/SearchBar';
import {
    MessageKeys,
    useFormatMessage,
} from '../../../../../localization/useFormatMessage';
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    CustomDropDown,
    CustomDropDownOption,
} from '../../../../../components/CustomDropDown/CustomDropDown';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AdaptationStepsType } from '../../adaptationSteps';
import { abbreviateNumber, currencyValueFormatter } from '../../../../../utils';
import { map, sumBy, uniq } from 'lodash';
import {
    AnalysisSettingsWithMetadataResponse,
    LocationAssetAttributes,
} from '../../../../../api/openapi/auto-generated';
import { CoveredLoadingSpinner } from '../../../../../components/CoveredLoadingSpinner/CoveredLoadingSpinner';

function occupancyStringGen(loc: LocationAssetAttributes): string {
    return `${loc.occupancyScheme} ${loc.occupancyCode}`;
}

const COLUMNS: (GridColDef<LocationAssetAttributes> & {
    field: keyof LocationAssetAttributes;
    headerName: MessageKeys;
})[] = [
    {
        field: 'customerLocationId',
        headerName: 'adaptation.selection_screen.table.locationId',
    },
    {
        field: 'locationName',
        headerName: 'adaptation.selection_screen.table.locationName',
    },
    {
        field: 'countryCodeIso2a',
        headerName: 'adaptation.selection_screen.table.countryCodeISO2A',
    },
    {
        field: 'admin1Code',
        headerName: 'adaptation.selection_screen.table.admin1Code',
    },
    {
        field: 'occupancyCode',
        headerName: 'adaptation.selection_screen.table.occupancyCode',
        valueFormatter: (_, row) => occupancyStringGen(row),
    },
    {
        field: 'occupancyName',
        headerName: 'adaptation.selection_screen.table.occupancyName',
    },
    {
        field: 'entity',
        headerName: 'adaptation.selection_screen.table.entity',
    },
    {
        field: 'totalValue',
        headerName: 'adaptation.selection_screen.table.totalValue',
        valueFormatter: (value: number) =>
            currencyValueFormatter({ value, decimalPlaces: 0 }),
    },
    {
        field: 'unadaptedAal2025',
        headerName: 'adaptation.selection_screen.table.unadaptedAAL',
        valueFormatter: (value: number) =>
            currencyValueFormatter({ value, decimalPlaces: 0 }),
    },
    {
        field: 'unadaptedAal2055',
        headerName: 'adaptation.selection_screen.table.unadaptedAAL2055',
        valueFormatter: (value: number) =>
            currencyValueFormatter({ value, decimalPlaces: 0 }),
    },
];
export type AdaptationLandingPageProps = {
    setView: Dispatch<SetStateAction<AdaptationStepsType>>;
    analysisSettings?: AnalysisSettingsWithMetadataResponse;
    isLoadingAnalysisSettings: boolean;
    setSelectedLocationIds: Dispatch<SetStateAction<number[]>>;
    selectedLocationIds: number[];
    isLocationListLoading: boolean;
    locationList?: LocationAssetAttributes[];
};

function checkboxMapper(str: string) {
    return {
        name: str,
        value: str,
        selected: false,
    };
}

function optionClearer(
    setter: Dispatch<SetStateAction<CustomDropDownOption[]>>
) {
    return () => {
        setter((old) => old.map((v) => ({ ...v, selected: false })));
    };
}

export function AdaptationLandingPage({
    setView,
    isLoadingAnalysisSettings,
    analysisSettings,
    setSelectedLocationIds,
    selectedLocationIds,
    locationList,
    isLocationListLoading,
}: AdaptationLandingPageProps) {
    const formatMessage = useFormatMessage();
    const currYear = useMemo(() => new Date().getUTCFullYear(), []);

    const [searchValue, setSearchValue] = useState('');
    const [countryOptions, setCountryOptions] = useState<
        CustomDropDownOption[]
    >([]);
    const [entityOptions, setEntityOptions] = useState<CustomDropDownOption[]>(
        []
    );
    const [occupancyOptions, setOccupancyOptions] = useState<
        CustomDropDownOption[]
    >([]);
    const [rowSelectionModel, setRowSelectionModel] =
        useState<GridRowSelectionModel>({
            type: 'include',
            ids: new Set(selectedLocationIds),
        });

    const columns = useMemo<GridColDef<LocationAssetAttributes>[]>(
        () =>
            COLUMNS.map((col) => ({
                field: col.field,
                headerName: formatMessage(col.headerName),
                valueFormatter: col?.valueFormatter,
                flex: 1,
                filterable: false,
            })),
        [formatMessage]
    );

    const totalKpis = useMemo<{
        totalAssets: number;
        totalValue: number;
        totalUAAL: number;
    }>(
        () =>
            locationList
                ? {
                      totalAssets: locationList.length,
                      totalValue: sumBy(locationList, 'totalValue'),
                      totalUAAL: sumBy(locationList, 'unadaptedAal2025'),
                  }
                : {
                      totalAssets: 0,
                      totalValue: 0,
                      totalUAAL: 0,
                  },
        [locationList]
    );

    const portfolioKpis = useMemo<Kpi[]>(
        () => [
            {
                name: 'adaptation-total-assets',
                title: formatMessage('adaptation.selection_screen.kpi.assets'),
                value: totalKpis.totalAssets.toString(),
                showSymbol: false,
            },
            {
                name: 'adaptation-total-asset-value',
                title: formatMessage(
                    'adaptation.selection_screen.kpi.asset_value'
                ),
                value: abbreviateNumber(totalKpis.totalValue),
                showSymbol: true,
            },
            {
                name: 'adaptation-unadapted-average-annual-loss',
                title: formatMessage(
                    'adaptation.selection_screen.kpi.unadapted_average_annual_loss',
                    { year: currYear }
                ),
                value: abbreviateNumber(totalKpis.totalUAAL),
                showSymbol: true,
            },
        ],
        [formatMessage, currYear, totalKpis]
    );

    const selectedKpis = useMemo(() => {
        let assetVal = 0;
        let uAAL = 0;
        let count = rowSelectionModel.ids.size;
        if (locationList) {
            rowSelectionModel.ids.forEach((rowId) => {
                const loc = locationList.find(
                    (v) => v.customerLocationId === rowId
                );
                assetVal += loc?.totalValue || 0;
                uAAL += loc?.unadaptedAal2025 || 0;
            });

            if (rowSelectionModel.type === 'exclude') {
                count = totalKpis.totalAssets - count;
                assetVal = totalKpis.totalValue - assetVal;
                uAAL = totalKpis.totalUAAL - uAAL;
            }
        }

        return [
            {
                name: 'adaptation-selected-assets',
                title: formatMessage('adaptation.selection_screen.kpi.assets'),
                value: count.toString(),
                showSymbol: false,
            },
            {
                name: 'adaptation-selected-asset-value',
                title: formatMessage(
                    'adaptation.selection_screen.kpi.asset_value'
                ),
                value: abbreviateNumber(assetVal),
                showSymbol: true,
            },
            {
                name: 'adaptation-unadapted-average-annual-loss',
                title: formatMessage(
                    'adaptation.selection_screen.kpi.unadapted_average_annual_loss',
                    { year: currYear }
                ),
                value: abbreviateNumber(uAAL),
                showSymbol: true,
            },
        ];
    }, [locationList, rowSelectionModel, formatMessage, currYear, totalKpis]);

    const handleLaunch = useCallback(() => {
        if (isLoadingAnalysisSettings || !locationList) return;

        let locationIds: number[] = [];
        if (rowSelectionModel.type === 'exclude') {
            locationIds = map(locationList, 'customerLocationId').filter(
                (v) => !rowSelectionModel.ids.has(v)
            );
        } else {
            locationIds = Array.from(rowSelectionModel.ids) as number[];
        }

        setSelectedLocationIds(locationIds);

        if (!analysisSettings?.settingsConfirmed) {
            setView('settingsView');
            return;
        }

        setView('visualizations');
    }, [
        setView,
        analysisSettings,
        isLoadingAnalysisSettings,
        locationList,
        rowSelectionModel,
        setSelectedLocationIds,
    ]);

    const countryFilter = useMemo(
        () =>
            map(
                countryOptions.filter((o) => o.selected),
                'value'
            ),
        [countryOptions]
    );
    const occupancyFilter = useMemo(
        () =>
            map(
                occupancyOptions.filter((o) => o.selected),
                'value'
            ),
        [occupancyOptions]
    );
    const entityFilter = useMemo(
        () =>
            map(
                entityOptions.filter((o) => o.selected),
                'value'
            ),
        [entityOptions]
    );
    const filteredView = useMemo(() => {
        return locationList?.filter((v) => {
            let visible = true;
            if (searchValue) {
                visible =
                    !!v.locationName &&
                    v.locationName
                        .toLowerCase()
                        .includes(searchValue.toLowerCase());
            }
            if (countryFilter.length) {
                visible =
                    !!v.countryCodeIso2a &&
                    visible &&
                    countryFilter.includes(v.countryCodeIso2a);
            }
            if (entityFilter.length) {
                visible =
                    !!v.entity && visible && entityFilter.includes(v.entity);
            }
            if (occupancyFilter.length) {
                visible =
                    !!v.occupancyCode &&
                    !!v.occupancyScheme &&
                    visible &&
                    occupancyFilter.includes(occupancyStringGen(v));
            }

            return visible;
        });
    }, [
        locationList,
        countryFilter,
        entityFilter,
        occupancyFilter,
        searchValue,
    ]);

    useEffect(() => {
        if (!locationList) return;
        let c: string[] = [];
        let e: string[] = [];
        let o: string[] = [];

        for (const loc of locationList) {
            if (loc.countryCodeIso2a) {
                c.push(loc.countryCodeIso2a);
            }
            if (loc.entity) {
                e.push(loc.entity);
            }
            if (loc.occupancyCode) {
                o.push(occupancyStringGen(loc));
            }
        }

        c = uniq(c);
        e = uniq(e);
        o = uniq(o);

        setCountryOptions(c.map(checkboxMapper));
        setEntityOptions(e.map(checkboxMapper));
        setOccupancyOptions(o.map(checkboxMapper));
    }, [locationList]);

    return (
        <CoveredLoadingSpinner
            isLoading={isLocationListLoading}
            testId={'adaptation-landing-page-spinner'}
        >
            <Box
                display={'grid'}
                gridTemplateRows={'min-content min-content 1fr'}
                padding={'16px 0'}
            >
                <Box
                    padding={'0 60px 16px'}
                    display={'flex'}
                    justifyContent={'center'}
                    gap={'46px'}
                >
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                        flexGrow={'1'}
                        maxWidth={'500px'}
                        marginRight={'auto'}
                    >
                        <Typography
                            typography={'h2'}
                            textTransform={'uppercase'}
                            data-testid={
                                'adaptation-landing-page-portfolio-kpis-label'
                            }
                        >
                            {formatMessage(
                                'adaptation.selection_screen.kpi.portfolio'
                            )}
                        </Typography>
                        <KpiViewer
                            testId={'adaptation-landing-page-portfolio-kpis'}
                            kpis={portfolioKpis}
                        />
                    </Box>
                    <Divider
                        orientation="vertical"
                        sx={{ height: 'inherit' }}
                    />
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={'10px'}
                        flexGrow={'1'}
                        maxWidth={'500px'}
                        marginRight={'auto'}
                    >
                        <Typography
                            typography={'h2'}
                            textTransform={'uppercase'}
                            data-testid={
                                'adaptation-landing-page-selected-kpis-label'
                            }
                        >
                            {formatMessage(
                                'adaptation.selection_screen.kpi.selected_assets'
                            )}
                        </Typography>
                        <KpiViewer
                            testId={'adaptation-landing-page-selected-kpis'}
                            kpis={selectedKpis}
                        />
                    </Box>
                </Box>
                <Divider />
                <Box
                    padding={'20px 60px 0'}
                    display={'grid'}
                    gap={'24px'}
                    gridTemplateRows={'min-content 1fr min-content'}
                    height={'calc(100vh - 305px)'}
                >
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Box
                            maxWidth={'400px'}
                            flexGrow={'1'}
                        >
                            <SearchBar
                                testId={'asset-selection'}
                                onChange={setSearchValue}
                                value={searchValue}
                                placeholder={formatMessage('search_bar.search')}
                            />
                        </Box>
                        <Box
                            display={'flex'}
                            gap={'28px'}
                        >
                            <Box data-testid={'filter-country'}>
                                <CustomDropDown
                                    checkable
                                    showCountBadge={!!countryFilter.length}
                                    options={countryOptions}
                                    onApplySelectionChange={setCountryOptions}
                                    onClearSelectionChange={optionClearer(
                                        setCountryOptions
                                    )}
                                    label={formatMessage(
                                        'adaptation.selection_screen.filter.country'
                                    )}
                                />
                            </Box>
                            <Box data-testid={'filter-occupancy'}>
                                <CustomDropDown
                                    checkable
                                    options={occupancyOptions}
                                    showCountBadge={!!occupancyFilter.length}
                                    onApplySelectionChange={setOccupancyOptions}
                                    onClearSelectionChange={optionClearer(
                                        setOccupancyOptions
                                    )}
                                    label={formatMessage(
                                        'adaptation.selection_screen.filter.occupancy'
                                    )}
                                />
                            </Box>
                            <Box data-testid={'filter-entity'}>
                                <CustomDropDown
                                    checkable
                                    options={entityOptions}
                                    showCountBadge={!!entityFilter.length}
                                    onApplySelectionChange={setEntityOptions}
                                    onClearSelectionChange={optionClearer(
                                        setEntityOptions
                                    )}
                                    label={formatMessage(
                                        'adaptation.selection_screen.filter.entity'
                                    )}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <DataGrid
                        keepNonExistentRowsSelected
                        columns={columns}
                        checkboxSelection
                        rows={filteredView}
                        getRowId={(row) => row.customerLocationId!}
                        rowSelectionModel={rowSelectionModel}
                        onRowSelectionModelChange={setRowSelectionModel}
                        data-testid={'landing-data-grid'}
                    />
                    <Box
                        display={'flex'}
                        justifyContent={'end'}
                    >
                        <Button
                            variant={'contained'}
                            size={'large'}
                            color={'secondary'}
                            onClick={handleLaunch}
                            data-testid={
                                'adaptation-landing-page-launch-button'
                            }
                        >
                            {formatMessage(
                                'adaptation.selection_screen.launch'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </CoveredLoadingSpinner>
    );
}
