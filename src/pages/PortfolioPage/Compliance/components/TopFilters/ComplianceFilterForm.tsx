import Grid from '@mui/material/Unstable_Grid2';
import { Box, Divider } from '@mui/material';
import { ComponentProps, FC, useCallback, useEffect, useMemo } from 'react';
import {
    DisclosureAvailability,
    DisclosureCategory,
    EUHazardMetadata,
    PerilsOptionsOutput,
} from '../../../../../api/openapi/auto-generated';
import { Scenario } from '../../../../../types';
import { FormikProvider, useFormik } from 'formik';
import { ScenarioSelectFormControl } from '../../../../../components/FormControls/ScenarioSelectFormControl';
import { FormikValuesChangeListener } from '../../../../../components/Formik/FormikValuesChangeListener';
import { YearsSelectFormControl } from './YearsSelectFormControl';
import { FiltersConfigurationIcon } from './FiltersConfigurationIcon';
import { HazardCategorySelector } from './HazardCategorySelector';
import {
    ALL_CLIMATE_RELATED_CATEGORY_VALUE,
    RESULT_SET_MIN_YEAR_FROM,
} from '../../../../../const';
import {
    useComplianceCategories,
    useComplianceEUMetrics,
    useUpdateComplianceEUMetrics,
} from '../../context/ComplienceDataSettingsContext';

export interface ComplianceFilterValues {
    category: DisclosureCategory | typeof ALL_CLIMATE_RELATED_CATEGORY_VALUE;
    years?: number[];
    scenario?: Scenario | '';
}

const initialFormValues: ComplianceFilterValues = {
    category: ALL_CLIMATE_RELATED_CATEGORY_VALUE,
    years: [],
    scenario: '',
};

interface ComplianceFiltersFormProps extends ComponentProps<typeof Box> {
    urlFilterParams: ComplianceFilterValues;
    resultSetOptions: PerilsOptionsOutput;
    resultSetMetadata: { [key: string]: EUHazardMetadata };
    onFiltersChange: (values: { [key: string]: string | number }) => void;
}

export const ComplianceFiltersForm: FC<ComplianceFiltersFormProps> = ({
    urlFilterParams,
    resultSetOptions,
    resultSetMetadata,
    onFiltersChange,
    ...props
}) => {
    const complianceFiltersForm = useFormik<ComplianceFilterValues>({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const euMetricIds = useComplianceEUMetrics();
    const updateEUMetricIds = useUpdateComplianceEUMetrics();

    const filteredMetadata = useMemo(() => {
        return Object.fromEntries(
            Object.entries(resultSetMetadata).filter(
                ([, value]) =>
                    value.availability !== DisclosureAvailability.notAvailable
            )
        );
    }, [resultSetMetadata]);

    useEffect(() => {
        if (!filteredMetadata) {
            return;
        }
        if (euMetricIds.length > 0) {
            return;
        }

        const allEUMetricIds = Object.keys(filteredMetadata).filter(
            (id) => filteredMetadata[id].show
        );

        updateEUMetricIds(allEUMetricIds);
    }, [filteredMetadata, euMetricIds.length, updateEUMetricIds]);

    const enabledCategories = useComplianceCategories();

    const availableInOptionYears = useMemo(
        () =>
            (resultSetOptions.years || [])
                .map((year) => Number(year))
                .filter((year) => year >= RESULT_SET_MIN_YEAR_FROM),
        [resultSetOptions.years]
    );

    const defaultYears = useMemo(() => {
        const defaultYears = [2025, 2040, 2050];

        const selectedYears: number[] = [];
        for (const year of defaultYears) {
            if (availableInOptionYears.includes(year)) {
                selectedYears.push(year);
            } else {
                const replacement = availableInOptionYears.find(
                    (y) => y > (selectedYears[selectedYears.length - 1] || 0)
                );
                if (replacement !== undefined) {
                    selectedYears.push(replacement);
                }
            }
        }

        return selectedYears;
    }, [availableInOptionYears]);

    const { setFieldValue } = complianceFiltersForm;

    useEffect(() => {
        const { category } = urlFilterParams;
        if (!category || category === ALL_CLIMATE_RELATED_CATEGORY_VALUE) {
            setFieldValue('category', ALL_CLIMATE_RELATED_CATEGORY_VALUE);
            return;
        }
        if (!enabledCategories.includes(category)) {
            setFieldValue('category', ALL_CLIMATE_RELATED_CATEGORY_VALUE);
            return;
        }

        setFieldValue('category', category);
    }, [urlFilterParams, setFieldValue, enabledCategories]);

    useEffect(() => {
        const { scenario } = urlFilterParams;
        if (!scenario) {
            return;
        }
        setFieldValue('scenario', scenario);
    }, [urlFilterParams, setFieldValue]);

    useEffect(() => {
        const { years } = urlFilterParams;
        if (!years) {
            return;
        }
        const urlYearsAvailableInOptions = years.filter((year) =>
            availableInOptionYears.includes(year)
        );
        const formYears =
            urlYearsAvailableInOptions.length === 0
                ? defaultYears
                : urlYearsAvailableInOptions;
        setFieldValue('years', formYears);
    }, [urlFilterParams, setFieldValue, availableInOptionYears, defaultYears]);

    const handleCategoryChange = useCallback(
        (
            category:
                | DisclosureCategory
                | typeof ALL_CLIMATE_RELATED_CATEGORY_VALUE
        ) => {
            setFieldValue('category', category);
        },
        [setFieldValue]
    );

    const handleYearsChange = useCallback(
        (years: number[]) => {
            setFieldValue('years', years);
        },
        [setFieldValue]
    );

    return (
        <Box
            data-testid="compliance-filters"
            {...props}
        >
            <FormikProvider value={complianceFiltersForm}>
                <Grid container>
                    <Grid
                        xs={6}
                        px={4}
                        py={2}
                        alignContent="center"
                    >
                        <HazardCategorySelector
                            selectedCategory={
                                complianceFiltersForm.values.category
                            }
                            onCategorySelected={handleCategoryChange}
                            enabledCategories={enabledCategories}
                        />
                    </Grid>
                    <Grid xs={0}>
                        <Divider orientation="vertical" />
                    </Grid>
                    <Grid
                        xs={6}
                        px={4}
                        minHeight="4.875rem"
                    >
                        <Box
                            pt={2}
                            pb={1}
                            width="100%"
                            height="4.875rem"
                        >
                            <Grid
                                container
                                spacing={2}
                                data-testid="impacts-filters"
                            >
                                <Grid xs={3}>
                                    <ScenarioSelectFormControl
                                        resultSetOptions={resultSetOptions}
                                        initialValue={
                                            initialFormValues.scenario
                                        }
                                    />
                                </Grid>
                                <Grid xs={8}>
                                    <YearsSelectFormControl
                                        years={availableInOptionYears}
                                        initialValue={
                                            complianceFiltersForm.values
                                                .years || []
                                        }
                                        onYearsChange={handleYearsChange}
                                    />
                                </Grid>
                                <Grid xs={1}>
                                    <FiltersConfigurationIcon
                                        resultSetMetadata={filteredMetadata}
                                        currentlyViewedCategory={
                                            complianceFiltersForm.values
                                                .category
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <FormikValuesChangeListener
                    values={complianceFiltersForm.values}
                    onValuesChange={onFiltersChange}
                />
            </FormikProvider>
        </Box>
    );
};
