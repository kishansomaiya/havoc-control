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

export interface HazardFilterValues {
    metric?: string;
    yearFrom?: number;
    yearTo?: number | '';
    scenario?: Scenario | '';
    peril?: Score | '';
}

const initialFormValues: HazardFilterValues = {
    metric: '',
    yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
    yearTo: '',
    scenario: '',
    peril: '',
};

interface HazardFiltersFormProps extends ComponentProps<typeof Box> {
    urlFilterParams: HazardFilterValues;
    resultSetOptions: PerilsOptions;
    score: Score;
    resultSetSchema: Array<ResultSetDataSchema>;
    onFiltersChange: (values: { [key: string]: string | number }) => void;
}

export const HazardFiltersForm: FC<HazardFiltersFormProps> = ({
    urlFilterParams,
    resultSetOptions,
    score,
    resultSetSchema,
    onFiltersChange,
    ...props
}) => {
    const hazardFiltersForm = useFormik<HazardFilterValues>({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const { setFieldValue } = hazardFiltersForm;

    useEffect(() => {
        setFieldValue('peril', score);
    }, [score, setFieldValue]);

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
            <FormikProvider value={hazardFiltersForm}>
                <Grid
                    container
                    spacing={2}
                    data-testid="portfolio-hazard-filters"
                >
                    <Grid xs={3}>
                        <ScenarioSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.scenario}
                            data-testid="portfolio-hazard-filters-scenario"
                        />
                    </Grid>
                    <Grid xs={2}>
                        <YearSelectFormControl
                            resultSetOptions={resultSetOptions}
                            initialValue={initialFormValues.yearTo}
                            data-testid="portfolio-hazard-filters-year-to"
                        />
                    </Grid>
                    <Grid xs={7}>
                        <MetricSelectFormControl
                            resultSetSchema={resultSetSchema}
                            score={score}
                            initialValue={initialFormValues.metric}
                            data-testid="portfolio-hazard-filters-metric"
                        />
                    </Grid>
                </Grid>
                <FormikValuesChangeListener
                    values={hazardFiltersForm.values}
                    onValuesChange={onFiltersChange}
                    data-testid="portfolio-hazard-filters-change-listener"
                />
            </FormikProvider>
        </Box>
    );
};
