import {
    ChangeEvent,
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import {
    DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS,
    ECONOMIC_IMPACT_DISABLED_OPTIONS,
} from '../../../../../../../../const';
import { FormStringTextField } from '../../../../../../../../components/Inputs/FormStringTextField';
import { FormNumberTextField } from '../../../../../../../../components/Inputs/FormNumberTextField';
import { IPortfolio } from '../../../../../../types/portfolio';
import { GridField } from '../../../GridField';
import { GridFieldSet } from '../../../GridFieldSet';
import { SubSection } from '../../../SubSection';

interface FinancialMetricsSubSectionFormProps
    extends ComponentProps<typeof Box> {}

export const FinancialMetricsSubSectionForm: FC<
    FinancialMetricsSubSectionFormProps
> = ({ ...props }) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField, setFields } = formik;
    const { dataVersion, custom } = formik.values;

    const { financialParameters } = custom.economicImpacts;
    const { includeFinancialMetrics } = financialParameters;
    const {
        annualGrowth,
        annualVolatility,
        subIndustryCode,
        salesMargin,
        discountRate,
        generatePortfolioLevelResults,
    } = financialParameters.financialMetrics;

    const touched =
        formik.touched.custom?.economicImpacts?.financialParameters
            ?.financialMetrics;
    const errors =
        formik.errors.custom?.economicImpacts?.financialParameters
            ?.financialMetrics;
    const disabled = ECONOMIC_IMPACT_DISABLED_OPTIONS[dataVersion];
    const additionalOptions =
        DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS[dataVersion];

    const annualGrowthError = errors?.annualGrowth;
    const isAnnualGrowthError =
        touched?.annualGrowth && annualGrowthError !== undefined;

    const annualVolatilityError = errors?.annualVolatility;
    const isAnnualVolatilityError =
        touched?.annualVolatility && annualVolatilityError !== undefined;

    const subIndustryCodeError = errors?.subIndustryCode;
    const isSubIndustryCodeError =
        touched?.subIndustryCode && subIndustryCodeError !== undefined;

    const salesMarginError = errors?.salesMargin;
    const isSalesMarginError =
        touched?.salesMargin && salesMarginError !== undefined;

    const discountRateError = errors?.discountRate;
    const isDiscountRateError =
        touched?.discountRate && discountRateError !== undefined;

    const handleIncludeChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setFields({
                'custom.economicImpacts.financialParameters.financialMetrics.generatePortfolioLevelResults':
                    false,
                'custom.economicImpacts.financialParameters.includeFinancialMetrics':
                    event.target.checked,
            });
        },
        [setFields]
    );

    const handleGeneratePortfolioLevelResultsChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField(
                'custom.economicImpacts.financialParameters.financialMetrics.generatePortfolioLevelResults',
                event.target.checked
            );
        },
        [setField]
    );

    const checkFinancialMetricsEnabled = useMemo(() => {
        const finSupportedEIModulePresent = [
            custom.economicImpacts.advancedParameters.includeWorkerProductivity,
            custom.economicImpacts.advancedParameters.includeCostOfCooling,
            custom.economicImpacts.advancedParameters.includeWildfireLoss,
            custom.economicImpacts.advancedParameters.includeAcuteCombinedFlood,
            custom.economicImpacts.advancedParameters.includeAcuteWind,
        ].some((item) => item);

        return finSupportedEIModulePresent;
    }, [custom.economicImpacts.advancedParameters]);

    useEffect(() => {
        setFields({
            'custom.economicImpacts.financialParameters.financialMetrics.generatePortfolioLevelResults':
                checkFinancialMetricsEnabled,
            'custom.economicImpacts.financialParameters.includeFinancialMetrics':
                checkFinancialMetricsEnabled,
        });
    }, [checkFinancialMetricsEnabled, setFields]);

    return (
        <SubSection
            {...props}
            heading={
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            checked={includeFinancialMetrics}
                            onChange={handleIncludeChange}
                        />
                    }
                    label="Include Financial Metrics"
                    disabled={
                        additionalOptions.includeFinancialMetrics.disabled ||
                        !checkFinancialMetricsEnabled
                    }
                />
            }
        >
            <GridFieldSet>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.financialParameters.financialMetrics.annualGrowth"
                        label="Annual Growth Rate"
                        placeholder="Enter Value"
                        value={annualGrowth}
                        setField={setField}
                        fullWidth
                        disabled={
                            disabled.annualGrowth || !includeFinancialMetrics
                        }
                        error={isAnnualGrowthError}
                        helperText={
                            isAnnualGrowthError
                                ? annualGrowthError
                                : 'Assumed year-on-year percentage change, from 0-1, in total asset value'
                        }
                    />
                </GridField>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.financialParameters.financialMetrics.annualVolatility"
                        label="Annual Volatility Rate"
                        placeholder="Enter Value"
                        value={annualVolatility}
                        setField={setField}
                        fullWidth
                        disabled={
                            disabled.annualVolatility ||
                            !includeFinancialMetrics
                        }
                        error={isAnnualVolatilityError}
                        helperText={
                            isAnnualVolatilityError
                                ? annualVolatilityError
                                : 'Assumed standard deviation of the annual growth rate, from 0-1'
                        }
                    />
                </GridField>
                <GridField>
                    <FormStringTextField
                        name="custom.economicImpacts.financialParameters.financialMetrics.subIndustryCode"
                        label="GICS Sub-Industry Code"
                        placeholder="Enter Value"
                        value={subIndustryCode}
                        setField={setField}
                        fullWidth
                        disabled={
                            disabled.subIndustryCode || !includeFinancialMetrics
                        }
                        error={isSubIndustryCodeError}
                        helperText={
                            isSubIndustryCodeError
                                ? subIndustryCodeError
                                : '8-digit sub-industry GICS code from MSCI'
                        }
                    />
                </GridField>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.financialParameters.financialMetrics.salesMargin"
                        label="Sales Margin"
                        placeholder="Enter Value"
                        value={salesMargin}
                        setField={setField}
                        fullWidth
                        disabled={
                            disabled.salesMargin || !includeFinancialMetrics
                        }
                        error={isSalesMarginError}
                        helperText={
                            isSalesMarginError
                                ? salesMarginError
                                : "The ratio of a company's gross profit to its total revenues, after accounting for Cost of Goods Sold (COGS)"
                        }
                    />
                </GridField>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.financialParameters.financialMetrics.discountRate"
                        label="Discount Rate"
                        placeholder="Enter Value"
                        value={discountRate}
                        setField={setField}
                        fullWidth
                        disabled={
                            disabled.discountRate || !includeFinancialMetrics
                        }
                        error={isDiscountRateError}
                        helperText={
                            isDiscountRateError
                                ? discountRateError
                                : 'The discount rate applied when considering future climate risk impact on current valuations'
                        }
                    />
                </GridField>
            </GridFieldSet>
            <Box sx={{ paddingTop: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            checked={generatePortfolioLevelResults}
                            onChange={handleGeneratePortfolioLevelResultsChange}
                        />
                    }
                    label="Generate Portfolio-Level Results"
                    disabled={
                        additionalOptions.generatePortfolioLevelResults
                            .disabled || !includeFinancialMetrics
                    }
                />
            </Box>
        </SubSection>
    );
};
