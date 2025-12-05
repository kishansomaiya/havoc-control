import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { MessageKeys } from '../../../../../localization/useFormatMessage';
import { ChangeEvent, Dispatch, SetStateAction, useMemo } from 'react';
import { currencyValueFormatter, percentFormatter } from '../../../../../utils';
import { Select, SelectOption } from '../../../../../components/Select/Select';
import { Box, Checkbox } from '@mui/material';
import {
    designLevels,
    effectivenessLevels,
    implementationYears,
} from '../../config';

export type TabValues = 'loss' | 'flood' | 'wind' | 'wildfire' | 'heat';
export type CustomGridDef = GridColDef & { headerName: MessageKeys };

const implementationYearOptions = implementationYears.map((v) => ({
    label: v,
    value: v,
}));
const designLevelOptions = ['None', ...designLevels].map((v, i) => ({
    label: i === 0 ? v : `${v}-year`,
    value: i === 0 ? v : `${v}yr`,
}));
const effectivenessOptions = ['None', ...effectivenessLevels].map((v) => ({
    label: v,
    value: v,
}));

const baseColumns: CustomGridDef[] = [
    {
        field: 'locationId',
        headerName: 'adaptation.measure_settings.table.location_id',
    },
    {
        field: 'name',
        headerName: 'adaptation.measure_settings.table.location_name',
        minWidth: 200,
    },
    {
        field: 'occupancy',
        headerName: 'adaptation.measure_settings.table.occupancy',
        minWidth: 250,
    },
];

export type MeasureData = {
    locationId: number;
    locationName: string;
    occupancy: string;
    implementationYear: string;
    elevateStructure?: string;
    siteLevelProtection?: string;
    floodProofing?: boolean;
    windEngineeringRetrofit?: string;
    nonFlammableRoofMaterial?: boolean;
    doublePaneWindows?: boolean;
    emberResistantVents?: boolean;
    installAirConditioning?: string;
    coalRoof?: boolean;
    unadaptedAAL?: number;
    adaptedAAL?: number;
    delta?: number;
    capex?: number;
    npv?: number;
    roi?: number;
    breakevenYear?: number;
};

function dataUpdater<T = string>(
    id: number,
    values: MeasureData[],
    setterKey: keyof MeasureData,
    setter: Dispatch<SetStateAction<MeasureData[]>>
) {
    return (change: T) => {
        setter((old) => {
            const idx = old.findIndex((v) => v.locationId === id);
            if (idx === -1) {
                const val = values.find((v) => v.locationId === id);
                if (!val) {
                    return old;
                }
                (val[setterKey] as T) = change;
                return [...old, val];
            }
            const slice = old.slice();
            (slice[idx][setterKey] as T) = change;
            return slice;
        });
    };
}

const DropdownCol =
    (
        options: SelectOption[],
        setter: Dispatch<SetStateAction<MeasureData[]>>,
        loadedData: MeasureData[]
    ) =>
    (params: GridRenderCellParams) => {
        return (
            <Box
                height={'100%'}
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
            >
                <Select
                    size={'small'}
                    value={params.value}
                    options={options}
                    onChange={dataUpdater(
                        params.id as never,
                        loadedData,
                        params.colDef.field as keyof MeasureData,
                        setter
                    )}
                />
            </Box>
        );
    };

const ColoredCell = (color: string) => (params: GridRenderCellParams) => (
    <span style={{ color }}>{params.formattedValue}</span>
);

const CheckboxCell =
    (
        setter: Dispatch<SetStateAction<MeasureData[]>>,
        loadedData: MeasureData[]
    ) =>
    (params: GridRenderCellParams) => (
        <Checkbox
            checked={params.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const change = e.target.checked;
                dataUpdater<boolean>(
                    params.id as never,
                    loadedData,
                    params.colDef.field as keyof MeasureData,
                    setter
                )(change);
            }}
        />
    );

const currencyFormatter = (value?: number) => {
    let val = value;
    if (!val || Number.isNaN(val)) val = 0;
    return currencyValueFormatter({ value: val, decimalPlaces: 0 });
};

export function useTableColumns(
    loadedData: MeasureData[],
    dataSetter: Dispatch<SetStateAction<MeasureData[]>>
) {
    const lossColumns: CustomGridDef[] = useMemo(
        () => [
            ...baseColumns,
            {
                field: 'implementationYear',
                headerName:
                    'adaptation.measure_settings.table.implementation_year',
                flex: 1,
                renderCell: DropdownCol(
                    implementationYearOptions,
                    dataSetter,
                    loadedData
                ),
            },
            {
                field: 'unadaptedAAL',
                headerName: 'adaptation.measure_settings.table.unadapted_aal',
                flex: 1,
                renderCell: ColoredCell('#DB5138'),
                valueFormatter: currencyFormatter,
            },
            {
                field: 'adaptedAAL',
                headerName: 'adaptation.measure_settings.table.adapted_aal',
                flex: 1,
                renderCell: ColoredCell('#0AB490'),
                valueFormatter: currencyFormatter,
            },
            {
                field: 'delta',
                headerName: 'adaptation.measure_settings.table.delta',
                valueFormatter: currencyFormatter,
            },
            {
                field: 'capex',
                headerName: 'adaptation.measure_settings.table.capex',
                valueFormatter: currencyFormatter,
            },
            {
                field: 'roi',
                headerName: 'adaptation.measure_settings.table.roi',
                valueFormatter: percentFormatter,
            },
            {
                field: 'npv',
                headerName: 'adaptation.measure_settings.table.npv',
                valueFormatter: currencyFormatter,
            },
            {
                field: 'breakevenYear',
                headerName: 'adaptation.measure_settings.table.breakeven_year',
            },
        ],
        [dataSetter, loadedData]
    );

    const floodColumns: CustomGridDef[] = useMemo(
        () => [
            ...baseColumns,
            {
                field: 'elevateStructure',
                headerName:
                    'adaptation.measure_settings.table.elevate_structure',
                flex: 1,
                renderCell: DropdownCol(
                    designLevelOptions,
                    dataSetter,
                    loadedData
                ),
            },
            {
                field: 'siteLevelProtection',
                headerName:
                    'adaptation.measure_settings.table.site_level_protection',
                flex: 1,
                renderCell: DropdownCol(
                    designLevelOptions,
                    dataSetter,
                    loadedData
                ),
            },
            {
                field: 'floodProofing',
                headerName: 'adaptation.measure_settings.table.flood_proofing',
                flex: 1,
                renderCell: CheckboxCell(dataSetter, loadedData),
            },
        ],
        [dataSetter, loadedData]
    );

    const windColumns: CustomGridDef[] = useMemo(
        () => [
            ...baseColumns,
            {
                field: 'windEngineeringRetrofit',
                headerName:
                    'adaptation.measure_settings.table.wind_engineering_retrofit',
                flex: 1,
                renderCell: DropdownCol(
                    designLevelOptions,
                    dataSetter,
                    loadedData
                ),
            },
        ],
        [dataSetter, loadedData]
    );
    const wildfireColumns: CustomGridDef[] = useMemo(
        () => [
            ...baseColumns,
            {
                field: 'nonFlammableRoofMaterial',
                headerName:
                    'adaptation.measure_settings.table.non_flammable_roof_material',
                flex: 1,
                renderCell: CheckboxCell(dataSetter, loadedData),
            },
            {
                field: 'doublePaneWindows',
                headerName:
                    'adaptation.measure_settings.table.double_pane_windows',
                flex: 1,
                renderCell: CheckboxCell(dataSetter, loadedData),
            },
            {
                field: 'emberResistantVents',
                headerName:
                    'adaptation.measure_settings.table.ember_resistant_vents',
                flex: 1,
                renderCell: CheckboxCell(dataSetter, loadedData),
            },
        ],
        [dataSetter, loadedData]
    );
    const heatColumns: CustomGridDef[] = useMemo(
        () => [
            ...baseColumns,
            {
                field: 'installAirConditioning',
                headerName:
                    'adaptation.measure_settings.table.install_air_conditioning',
                flex: 1,
                renderCell: DropdownCol(
                    effectivenessOptions,
                    dataSetter,
                    loadedData
                ),
            },
            {
                field: 'coolRoof',
                headerName: 'adaptation.measure_settings.table.cool_roof',
                flex: 1,
                renderCell: CheckboxCell(dataSetter, loadedData),
            },
        ],
        [dataSetter, loadedData]
    );

    const tabColumns: Record<TabValues, CustomGridDef[]> = useMemo(
        () => ({
            loss: lossColumns,
            flood: floodColumns,
            wind: windColumns,
            wildfire: wildfireColumns,
            heat: heatColumns,
        }),
        [lossColumns, floodColumns, windColumns, wildfireColumns, heatColumns]
    );
    return tabColumns;
}
