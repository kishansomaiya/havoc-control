import { Box } from '@mui/material';
import { ComponentProps, FC, useEffect } from 'react';
import { PerilsOptions } from '../../../../api/openapi/auto-generated';
import { Scenario } from '../../../../types';
import { RESULT_SET_DEFAULT_YEAR_FROM } from '../../../../const';
import { FormikProvider, useFormik } from 'formik';
import Grid from '@mui/material/Unstable_Grid2';
import { ScenarioSelectFormControl } from '../../../../components/FormControls/ScenarioSelectFormControl';
import { YearSelectFormControl } from '../../../../components/FormControls/YearSelectFormControl';
import { FormikValuesChangeListener } from '../../../../components/Formik/FormikValuesChangeListener';

export interface LocationHazardFilterValues {
    yearFrom?: number;
    yearTo?: number | '';
    scenario?: Scenario | '';
}

const initialFormValues: LocationHazardFilterValues = {
    yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
    yearTo: '',
    scenario: '',
};

interface LocationHazardFiltersFormProps extends ComponentProps<typeof Box> {
    urlFilterParams: LocationHazardFilterValues;
    resultSetOptions: PerilsOptions;
    onFiltersChange?: (values: {
        yearFrom: number;
        yearTo: number;
        scenario: Scenario;
    }) => void;
}

export const LocationHazardFiltersForm: FC<LocationHazardFiltersFormProps> = ({
    urlFilterParams,
    resultSetOptions,
    onFiltersChange,
    ...props
}) => {
    const hazardFiltersForm = useFormik<LocationHazardFilterValues>({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const { setFieldValue } = hazardFiltersForm;

    useEffect(() => {
        const { yearTo, scenario } = urlFilterParams;
        if (yearTo) {
            setFieldValue('yearTo', yearTo);
        }
        if (scenario) {
            setFieldValue('scenario', scenario);
        }
    }, [urlFilterParams, setFieldValue]);

    return (
        <Box {...props}>
            <FormikProvider value={hazardFiltersForm}>
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        xs={4}
                        xsOffset={4}
                        data-testid="slp-hazard-filters-scenario"
                    >
                        <ScenarioSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.scenario}
                        />
                    </Grid>
                    <Grid
                        xs={4}
                        data-testid="slp-hazard-filters-year"
                    >
                        <YearSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.yearTo}
                        />
                    </Grid>
                </Grid>
                <FormikValuesChangeListener
                    values={hazardFiltersForm.values}
                    onValuesChange={(values) => {
                        onFiltersChange?.(
                            values as {
                                yearFrom: number;
                                yearTo: number;
                                scenario: Scenario;
                            }
                        );
                    }}
                />
            </FormikProvider>
        </Box>
    );
};
