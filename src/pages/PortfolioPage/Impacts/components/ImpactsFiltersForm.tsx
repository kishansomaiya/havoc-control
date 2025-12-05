import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import { ComponentProps, FC, useEffect } from 'react';
import { PerilsOptions } from '../../../../api/openapi/auto-generated';
import { Scenario } from '../../../../types';
import { FormikProvider, useFormik } from 'formik';
import { RESULT_SET_DEFAULT_YEAR_FROM } from '../../../../const';
import { ScenarioSelectFormControl } from '../../../../components/FormControls/ScenarioSelectFormControl';
import { YearSelectFormControl } from '../../../../components/FormControls/YearSelectFormControl';
import { FormikValuesChangeListener } from '../../../../components/Formik/FormikValuesChangeListener';

export interface ImpactsFilterValues {
    yearFrom?: number;
    yearTo?: number | '';
    scenario?: Scenario | '';
}

const initialFormValues: ImpactsFilterValues = {
    yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
    yearTo: '',
    scenario: '',
};

interface ImpactsFiltersFormProps extends ComponentProps<typeof Box> {
    urlFilterParams: ImpactsFilterValues;
    resultSetOptions: PerilsOptions;
    onFiltersChange: (values: { [key: string]: string | number }) => void;
}

export const ImpactsFiltersForm: FC<ImpactsFiltersFormProps> = ({
    urlFilterParams,
    resultSetOptions,
    onFiltersChange,
    ...props
}) => {
    const impactsFiltersForm = useFormik<ImpactsFilterValues>({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const { setFieldValue } = impactsFiltersForm;

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
        <Box
            py={2}
            px={4}
            {...props}
        >
            <FormikProvider value={impactsFiltersForm}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="flex-end"
                    data-testid="impacts-filters"
                >
                    <Grid xs={2}>
                        <ScenarioSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.scenario}
                        />
                    </Grid>
                    <Grid xs={2}>
                        <YearSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.yearTo}
                        />
                    </Grid>
                </Grid>
                <FormikValuesChangeListener
                    values={impactsFiltersForm.values}
                    onValuesChange={onFiltersChange}
                />
            </FormikProvider>
        </Box>
    );
};
