import { Box } from '@mui/material';
import { ComponentProps, FC, useEffect } from 'react';
import { PerilsOptions } from '../../../../api/openapi/auto-generated';
import { ImpactType, LossType, Scenario } from '../../../../types';
import { RESULT_SET_DEFAULT_YEAR_FROM } from '../../../../const';
import { FormikProvider, useFormik } from 'formik';
import Grid from '@mui/material/Unstable_Grid2';
import { ScenarioSelectFormControl } from '../../../../components/FormControls/ScenarioSelectFormControl';
import { YearSelectFormControl } from '../../../../components/FormControls/YearSelectFormControl';
import { FormikValuesChangeListener } from '../../../../components/Formik/FormikValuesChangeListener';
import { LossTypeSelectFormControl } from '../../../../components/FormControls/LossTypeSelectFormControl';

export interface LocationDamageAndLossFilterValues {
    yearFrom: number;
    yearTo: number;
    scenario: Scenario;
    lossType: LossType;
}

export interface LocationDamageAndLossFilterOptionalValues {
    yearFrom?: number;
    yearTo?: number | '';
    scenario?: Scenario | '';
    lossType?: LossType;
}

const initialFormValues: LocationDamageAndLossFilterOptionalValues = {
    yearFrom: RESULT_SET_DEFAULT_YEAR_FROM,
    yearTo: '',
    scenario: '',
    lossType: LossType.Total,
};

interface LocationDamageAndLossFilterFromProps
    extends ComponentProps<typeof Box> {
    urlFilterParams: LocationDamageAndLossFilterOptionalValues;
    resultSetOptions: PerilsOptions;
    onFiltersChange?: (values: LocationDamageAndLossFilterValues) => void;
    impactType: ImpactType;
}

export const LocationDamageAndLossFiltersForm: FC<
    LocationDamageAndLossFilterFromProps
> = ({
    urlFilterParams,
    resultSetOptions,
    onFiltersChange,
    impactType,
    ...props
}) => {
        const filtersForm = useFormik<LocationDamageAndLossFilterOptionalValues>({
            initialValues: initialFormValues,
            onSubmit: () => { },
            enableReinitialize: true,
        });

        const { setFieldValue } = filtersForm;

        useEffect(() => {
            const { yearTo, scenario, lossType } = urlFilterParams;
            if (yearTo) {
                setFieldValue('yearTo', yearTo);
            }
            if (scenario) {
                setFieldValue('scenario', scenario);
            }
            if (lossType) {
                setFieldValue('lossType', lossType);
            }
        }, [urlFilterParams, setFieldValue]);

        return (
            <Box {...props}>
                <FormikProvider value={filtersForm}>
                    <Grid
                        container
                        spacing={2}
                        data-testid="slp-damage-loss-filters"
                    >
                        <Grid
                            xs={4}
                            data-testid="slp-damage-loss-filters-type"
                        >
                            <LossTypeSelectFormControl
                                initialValue={initialFormValues.lossType}
                                impactType={impactType}
                            />
                        </Grid>
                        <Grid
                            xs={4}
                            data-testid="slp-damage-loss-filters-scenario"
                        >
                            <ScenarioSelectFormControl
                                resultSetOptions={resultSetOptions}
                                initialValue={initialFormValues.scenario}
                            />
                        </Grid>
                        <Grid
                            xs={4}
                            data-testid="slp-damage-loss-filters-year"
                        >
                            <YearSelectFormControl
                                resultSetOptions={resultSetOptions}
                                initialValue={initialFormValues.yearTo}
                            />
                        </Grid>
                    </Grid>
                    <FormikValuesChangeListener
                        values={filtersForm.values}
                        onValuesChange={(values) => {
                            onFiltersChange?.(
                                values as LocationDamageAndLossFilterValues
                            );
                        }}
                    />
                </FormikProvider>
            </Box>
        );
    };
