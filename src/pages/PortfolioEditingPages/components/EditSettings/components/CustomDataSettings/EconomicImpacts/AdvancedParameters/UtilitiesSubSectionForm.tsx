import { ChangeEvent, ComponentProps, FC, useCallback } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import {
    DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS,
    ECONOMIC_IMPACT_DISABLED_OPTIONS,
} from '../../../../../../../../const';
import { FormNumberTextField } from '../../../../../../../../components/Inputs/FormNumberTextField';
import { GridField } from '../../../GridField';
import { GridFieldSet } from '../../../GridFieldSet';
import { SubSection } from '../../../SubSection';
import { IPortfolio } from '../../../../../../types/portfolio';

interface UtilitiesSubSectionFormProps extends ComponentProps<typeof Box> {}

export const UtilitiesSubSectionForm: FC<UtilitiesSubSectionFormProps> = ({
    ...props
}) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const { advancedParameters } = custom.economicImpacts;
    const { includeUtilitiesCostOfWater } = advancedParameters;
    const { waterConsumption, waterShadowPriceRatio } =
        advancedParameters.utilitiesCostOfWater;

    const touched =
        formik.touched.custom?.economicImpacts?.advancedParameters
            ?.utilitiesCostOfWater;
    const errors =
        formik.errors.custom?.economicImpacts?.advancedParameters
            ?.utilitiesCostOfWater;
    const disabled = ECONOMIC_IMPACT_DISABLED_OPTIONS[dataVersion];
    const additionalOptions =
        DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS[dataVersion];

    const waterConsumptionError = errors?.waterConsumption;
    const isWaterConsumptionError =
        touched?.waterConsumption && waterConsumptionError !== undefined;

    const waterShadowPriceRatioError = errors?.waterShadowPriceRatio;
    const isWaterShadowPriceRatioError =
        touched?.waterShadowPriceRatio &&
        waterShadowPriceRatioError !== undefined;

    const handleIncludeChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField(
                'custom.economicImpacts.advancedParameters.includeUtilitiesCostOfWater',
                event.target.checked
            );
        },
        [setField]
    );

    return (
        <SubSection
            {...props}
            heading={
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            checked={includeUtilitiesCostOfWater}
                            onChange={handleIncludeChange}
                        />
                    }
                    label="Include Cost of Water"
                    disabled={
                        additionalOptions.includeUtilitiesCostOfWater.disabled
                    }
                />
            }
        >
            <GridFieldSet>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.advancedParameters.utilitiesCostOfWater.waterConsumption"
                        label="Water Consumption"
                        placeholder="Enter Value"
                        value={waterConsumption}
                        setField={setField}
                        fullWidth
                        disabled={
                            disabled.waterConsumption ||
                            !includeUtilitiesCostOfWater
                        }
                        error={isWaterConsumptionError}
                        helperText={
                            isWaterConsumptionError
                                ? waterConsumptionError
                                : 'Annual water consumption in cubic meters. Leave blank to have a value assigned based on occupancy'
                        }
                    />
                </GridField>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.advancedParameters.utilitiesCostOfWater.waterShadowPriceRatio"
                        label="Shadow Price Ratio"
                        placeholder="Enter Value"
                        value={waterShadowPriceRatio}
                        setField={setField}
                        fullWidth
                        disabled={
                            disabled.waterShadowPriceRatio ||
                            !includeUtilitiesCostOfWater
                        }
                        error={isWaterShadowPriceRatioError}
                        helperText={
                            isWaterShadowPriceRatioError
                                ? waterShadowPriceRatioError
                                : 'The expected ratio of the shadow price of water (i.e. the total economic value of water) to the effective price of water'
                        }
                    />
                </GridField>
            </GridFieldSet>
        </SubSection>
    );
};
