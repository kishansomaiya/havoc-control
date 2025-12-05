import { FinancialMetricViewType, Scenario } from '../../../../types';
import { RESULT_SET_DEFAULT_YEAR_FROM } from '../../../../const';
import { ComponentProps, FC, useEffect } from 'react';
import { Box } from '@mui/material';
import { PerilsOptions } from '../../../../api/openapi/auto-generated';
import { FormikProvider, useFormik } from 'formik';
import Grid from '@mui/material/Unstable_Grid2';
import { ScenarioSelectFormControl } from '../../../../components/FormControls/ScenarioSelectFormControl';
import { YearSelectFormControl } from '../../../../components/FormControls/YearSelectFormControl';
import { FormikValuesChangeListener } from '../../../../components/Formik/FormikValuesChangeListener';
import { FinancialMetricViewTypeSelectFormControl } from '../../../../components/FormControls/FinancialMetricViewTypeSelectFormControl';

export interface LocationFinancialMetricsFilterValues {
    yearFrom?: number;
    yearTo?: number | '';
    scenario?: Scenario | '';
    viewType?: FinancialMetricViewType;
}

const initialFormValues: LocationFinancialMetricsFilterValues = {
    yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
    yearTo: '',
    scenario: '',
    viewType: FinancialMetricViewType.TransmissionChannel,
};

interface LocationFinancialMetricsFiltersFormProps
    extends ComponentProps<typeof Box> {
    urlFilterParams: LocationFinancialMetricsFilterValues;
    resultSetOptions: PerilsOptions;
    onFiltersChange?: (values: {
        yearFrom: number;
        yearTo: number;
        scenario: Scenario;
        viewType: FinancialMetricViewType;
    }) => void;
}

export const LocationFinancialMetricsFiltersForm: FC<
    LocationFinancialMetricsFiltersFormProps
> = ({ urlFilterParams, resultSetOptions, onFiltersChange, ...props }) => {
    const financialMetricsFiltersForm =
        useFormik<LocationFinancialMetricsFilterValues>({
            initialValues: initialFormValues,
            onSubmit: () => {},
            enableReinitialize: true,
        });

    const { setFieldValue } = financialMetricsFiltersForm;

    useEffect(() => {
        const { yearTo, scenario, viewType } = urlFilterParams;
        if (yearTo) {
            setFieldValue('yearTo', yearTo);
        }
        if (scenario) {
            setFieldValue('scenario', scenario);
        }
        if (viewType) {
            setFieldValue('viewType', viewType);
        }
    }, [urlFilterParams, setFieldValue]);

    return (
        <Box {...props}>
            <FormikProvider value={financialMetricsFiltersForm}>
                <Grid
                    container
                    spacing={2}
                    data-testid="slp-financial-metrics-filters"
                >
                    <Grid xs={4}>
                        <FinancialMetricViewTypeSelectFormControl
                            initialValue={initialFormValues.viewType}
                            data-testid="slp-financial-metrics-filters-view-by"
                        />
                    </Grid>
                    <Grid xs={4}>
                        <ScenarioSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.scenario}
                            data-testid="slp-financial-metrics-filters-scenario"
                        />
                    </Grid>
                    <Grid xs={4}>
                        <YearSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.yearTo}
                            data-testid="slp-financial-metrics-filters-year"
                        />
                    </Grid>
                </Grid>
                <FormikValuesChangeListener
                    values={financialMetricsFiltersForm.values}
                    onValuesChange={(values) => {
                        onFiltersChange?.(
                            values as {
                                yearFrom: number;
                                yearTo: number;
                                scenario: Scenario;
                                viewType: FinancialMetricViewType;
                            }
                        );
                    }}
                />
            </FormikProvider>
        </Box>
    );
};
