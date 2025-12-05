import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import { ComponentProps, FC, useEffect } from 'react';
import {
    PerilsOptions,
    ResultSetDataSchema,
} from '../../../../api/openapi/auto-generated';
import { Scenario, Score } from '../../../../types';
import { FormikProvider, useFormik } from 'formik';
import { RESULT_SET_DEFAULT_YEAR_FROM } from '../../../../const';
import { ScenarioSelectFormControl } from '../../../../components/FormControls/ScenarioSelectFormControl';
import { YearSelectFormControl } from '../../../../components/FormControls/YearSelectFormControl';
import { FormikValuesChangeListener } from '../../../../components/Formik/FormikValuesChangeListener';
import { MetricSelectFormControl } from '../../../../components/FormControls/MetricSelectFormControl';

export interface FloodMeshFilterValues {
    metric?: string;
    yearFrom?: number;
    yearTo?: number | '';
    scenario?: Scenario | '';
}

const initialFormValues: FloodMeshFilterValues = {
    metric: '',
    yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
    yearTo: '',
    scenario: '',
};

interface FloodMeshFiltersFormProps extends ComponentProps<typeof Box> {
    urlFilterParams: FloodMeshFilterValues;
    resultSetOptions: PerilsOptions;
    resultSetSchema: Array<ResultSetDataSchema>;
    onFiltersChange: (values: { [key: string]: string | number }) => void;
}

export const LocationFloodMeshFiltersForm: FC<FloodMeshFiltersFormProps> = ({
    urlFilterParams,
    resultSetOptions,
    resultSetSchema,
    onFiltersChange,
    ...props
}) => {
    const floodMeshFiltersForm = useFormik<FloodMeshFilterValues>({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const { setFieldValue } = floodMeshFiltersForm;

    useEffect(() => {
        const { metric, yearTo, scenario } = urlFilterParams;
        if (metric) {
            setFieldValue('metric', metric);
        }
        if (yearTo) {
            setFieldValue('yearTo', yearTo);
        }
        if (scenario) {
            setFieldValue('scenario', scenario);
        }
    }, [urlFilterParams, setFieldValue]);

    return (
        <Box {...props}>
            <FormikProvider value={floodMeshFiltersForm}>
                <Grid
                    container
                    spacing={2}
                    data-testid="slp-floodmesh-filters"
                >
                    <Grid
                        xs={3}
                        data-testid="slp-floodmesh-filters-scenario"
                        >
                        <ScenarioSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.scenario}
                        />
                    </Grid>
                    <Grid
                        xs={2}
                        data-testid="slp-floodmesh-filters-year"
                    >
                        <YearSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.yearTo}
                        />
                    </Grid>
                    <Grid
                        xs={7}
                        data-testid="slp-floodmesh-filters-metrics"
                    >
                        <MetricSelectFormControl
                            resultSetSchema={resultSetSchema}
                            score={Score.Flood}
                            initialValue={initialFormValues.metric}
                        />
                    </Grid>
                </Grid>
                <FormikValuesChangeListener
                    values={floodMeshFiltersForm.values}
                    onValuesChange={onFiltersChange}
                />
            </FormikProvider>
        </Box>
    );
};
