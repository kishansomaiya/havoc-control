import { FC, useCallback, useEffect, useState } from 'react';
import {
    CustomDropDown,
    CustomDropDownOption,
} from '../../../components/CustomDropDown/CustomDropDown';
import { Box } from '@mui/material';
import {
    IDashboardFilter,
    useDashboardFilterContext,
    useDashboardFilterContextUpdate,
} from '../../../context/DashboardFilterProvider';

export const DashboardFilters: FC = () => {
    const { filterData, isResultSetFiltersLoading } =
        useDashboardFilterContext();
    const updateDashboardFilters = useDashboardFilterContextUpdate();
    const [countryFilter, setCountryFilter] = useState<CustomDropDownOption[]>(
        []
    );
    const [stateFilter, setStateFilter] = useState<CustomDropDownOption[]>([]);
    const [occupancyNameFilter, setOccupancyNameFilter] = useState<
        CustomDropDownOption[]
    >([]);
    const [entityFilter, setEntityFilter] = useState<CustomDropDownOption[]>(
        []
    );

    const handleApplyFilterChange = useCallback(
        (
            filterKey: keyof IDashboardFilter,
            filterOptions: CustomDropDownOption[]
        ) => {
            if (!filterData[filterKey]) {
                return;
            }

            const newFilteredData = filterOptions.map((opt) => {
                const { name, value, selected = false } = opt;
                return { name, value, selected };
            });
            updateDashboardFilters({
                ...filterData,
                [filterKey]: newFilteredData,
            });
        },
        [filterData]
    );

    const handleClearFilter = useCallback(
        (filterKey: keyof IDashboardFilter) => {
            if (!filterData[filterKey]) {
                return;
            }

            const newFilteredData = filterData[filterKey].map((opt) => ({
                ...opt,
                selected: false,
            }));
            updateDashboardFilters({
                ...filterData,
                [filterKey]: newFilteredData,
            });
        },
        [filterData]
    );

    useEffect(() => {
        setCountryFilter(filterData.countryCodeISO2A);
        setStateFilter(filterData.admin1Code);
        setOccupancyNameFilter(filterData.occupancyName);
        setEntityFilter(filterData.entity);
    }, [filterData]);

    return (
        <Box
            display="flex"
            alignItems="center"
            px={1}
            py={1}
            gap={1}
        >
            <CustomDropDown
                checkable
                showCountBadge
                label="Country"
                options={countryFilter}
                loading={isResultSetFiltersLoading}
                onApplySelectionChange={(options) => {
                    handleApplyFilterChange('countryCodeISO2A', options);
                }}
                onClearSelectionChange={() => {
                    handleClearFilter('countryCodeISO2A');
                }}
            />
            <CustomDropDown
                checkable
                showCountBadge
                label="State"
                options={stateFilter}
                loading={isResultSetFiltersLoading}
                onApplySelectionChange={(options) => {
                    handleApplyFilterChange('admin1Code', options);
                }}
                onClearSelectionChange={() => {
                    handleClearFilter('admin1Code');
                }}
            />
            <CustomDropDown
                checkable
                showCountBadge
                label="Occupancy Name"
                options={occupancyNameFilter}
                loading={isResultSetFiltersLoading}
                onApplySelectionChange={(options) => {
                    handleApplyFilterChange('occupancyName', options);
                }}
                onClearSelectionChange={() => {
                    handleClearFilter('occupancyName');
                }}
            />
            <CustomDropDown
                checkable
                showCountBadge
                label="Entity"
                options={entityFilter}
                loading={isResultSetFiltersLoading}
                onApplySelectionChange={(options) => {
                    handleApplyFilterChange('entity', options);
                }}
                onClearSelectionChange={() => {
                    handleClearFilter('entity');
                }}
            />
        </Box>
    );
};
