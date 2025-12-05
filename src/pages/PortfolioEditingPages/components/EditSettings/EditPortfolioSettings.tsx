import {
    Box,
    Button,
    Container,
    Divider,
    FormHelperText,
    Typography,
    useTheme,
} from '@mui/material';
import {
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    MutableRefObject,
    useMemo,
} from 'react';
import { useFormik, FormikProps, FormikProvider } from 'formik';
import { isEmpty } from 'lodash';
import * as Icon from 'react-feather';
import { AnalysisTypeSelection } from './components/AnalysisTypeSelection';
import { AnalysisType } from '../../types/analysisTypeEnum';
import { CustomDataSettingsForm } from './components/CustomDataSettings/CustomDataSettingsForm';
import { DataSettingsForm } from './components/DataSettings/DataSettingsForm';
import { defaultCustomAnalysisData, IPortfolio } from '../../types/portfolio';
import { PrimaryInformationForm } from './components/PrimaryInformationForm';
import { portfolioFormSchema } from './schema/portfolioFormSchema';
import { useFormikHelpers } from '../../../../hooks/useFormikHelpers';
import { IPortfolioItem, Peril } from '../../../../types';
import { PortfolioInfo } from '../../../HomePage/components/PortfolioInfo';
import { AdditionalAnalyses } from './components/AdditionalAnalyses';

interface EditPortfolioSettingsProps extends ComponentProps<typeof Box> {
    initialFormValues: IPortfolio;
    onFormSubmit: (portfolio: IPortfolio) => void;
    onFormValidationChange: (isValid: boolean) => void;
    onEiConfigurationChange: (isEiModulePresnt: boolean) => void;
    formRef: MutableRefObject<FormikProps<IPortfolio> | null>;
    showChangeTypeOption: boolean;
    isMockPortfolio?: boolean;
    isNewPortfolio: boolean;
    currentPortfolioWithResultSets?: IPortfolioItem;
    isInitialDirty?: boolean;
}

export const EditPortfolioSettings: FC<EditPortfolioSettingsProps> = ({
    initialFormValues,
    onFormSubmit,
    onFormValidationChange,
    onEiConfigurationChange,
    formRef,
    showChangeTypeOption,
    isMockPortfolio = false,
    isNewPortfolio,
    currentPortfolioWithResultSets,
    isInitialDirty = false,
    ...props
}) => {
    const theme = useTheme();

    const isValidateOnMount = useMemo(() => {
        return !isEmpty(initialFormValues.name);
    }, [initialFormValues.name]);

    const formik = useFormik<IPortfolio>({
        initialValues: initialFormValues,
        onSubmit: onFormSubmit,
        enableReinitialize: true,
        validationSchema: portfolioFormSchema,
        validateOnChange: true,
        validateOnBlur: false,
        validateOnMount: !isNewPortfolio || isValidateOnMount,
        initialTouched: isNewPortfolio
            ? {
                name: isValidateOnMount,
            }
            : {
                name: true,
                category: true,
            },
    });
    formRef.current = formik;
    const {
        includeWorkerProductivity,
        includeCostOfCooling,
        includeWildfireLoss,
        includeUtilitiesCostOfWater,
    } = formik.values.custom.economicImpacts.advancedParameters;
    const { includeFinancialMetrics } =
        formik.values.custom.economicImpacts.financialParameters;

    const { setField, setFields } = useFormikHelpers(formik);

    const isDataVersionEnabled = formik.values.changeAnalysisType;
    const isRunDisclosureEnabled = formik.values.changeAnalysisType;
    const isRunAdaptationOpportunitiesAnalysisEnabled =
        formik.values.changeAnalysisType;
    const { isEconomicImpactsEnabled } = formik.values;

    useEffect(() => {
        onFormValidationChange(
            (isInitialDirty || formik.dirty) && formik.isValid
        );
    }, [onFormValidationChange, formik.dirty, formik.isValid, isInitialDirty]);

    const isAnyEIModuleIsPresent = useMemo(() => {
        const checkWindAndCombinedFloodPresentInPerils =
            formik.values.custom.perilMetrics.perils.some(
                (peril) => peril === Peril.Wind || peril === Peril.CombinedFlood
            );
        return (
            includeWorkerProductivity ||
            includeCostOfCooling ||
            includeWildfireLoss ||
            includeUtilitiesCostOfWater ||
            includeFinancialMetrics ||
            checkWindAndCombinedFloodPresentInPerils
        );
    }, [
        formik.values.custom.perilMetrics.perils,
        includeCostOfCooling,
        includeFinancialMetrics,
        includeUtilitiesCostOfWater,
        includeWildfireLoss,
        includeWorkerProductivity,
    ]);

    useEffect(() => {
        onEiConfigurationChange(
            !isEconomicImpactsEnabled || isAnyEIModuleIsPresent
        );
    }, [
        isAnyEIModuleIsPresent,
        isEconomicImpactsEnabled,
        onEiConfigurationChange,
    ]);

    const handleTypeChange = useCallback(
        async (type: AnalysisType) => {
            const previousType = formik.values.type;
            await setField('type', type);
            if (type !== AnalysisType.Custom) {
                return;
            }
            const dataVersion = formik.values.dataVersion;
            const custom = defaultCustomAnalysisData(dataVersion);
            await setField('custom', custom);
            if (previousType === AnalysisType.PerilsAndScores) {
                await setFields({
                    isPerilMetricsEnabled: true,
                    isEconomicImpactsEnabled: false,
                    isScoresEnabled: true,
                    isFloodMeshEnabled: false,
                });
            } else if (
                previousType === AnalysisType.PerilsScoresAndEconomicImpact
            ) {
                await setFields({
                    isPerilMetricsEnabled: true,
                    isEconomicImpactsEnabled: true,
                    isScoresEnabled: true,
                    isFloodMeshEnabled: false,
                });
            }
        },
        [formik.values.dataVersion, formik.values.type, setField, setFields]
    );

    const handleChangeTypeToDefault = useCallback(() => {
        handleTypeChange(AnalysisType.PerilsAndScores);
    }, [handleTypeChange]);

    const handleChangeTypeToCustom = useCallback(() => {
        handleTypeChange(AnalysisType.Custom);
    }, [handleTypeChange]);

    const customizeButton = !showChangeTypeOption ? (
        <Button
            variant="outlined"
            size="small"
            onClick={handleChangeTypeToCustom}
            data-testid="edit-settings-customize-button"
            disabled={formik.values.runDisclosureAnalysis}
        >
            <Icon.PenTool
                size="1rem"
                style={{
                    marginRight: '0.5rem',
                }}
            />
            Customize
        </Button>
    ) : null;

    const handleChangeTypeChange = useCallback(
        async (changeType: boolean) => {
            await setField('changeAnalysisType', changeType);
        },
        [setField]
    );

    return (
        <FormikProvider value={formik}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflowY: 'auto',
                }}
                {...props}
            >
                <Container>
                    <Box
                        py={5}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            alignSelf: 'stretch',
                            gap: 10,
                        }}
                        data-testid="edit-settings-form"
                    >
                        <PrimaryInformationForm
                            isDataVersionEnabled={isDataVersionEnabled}
                            isRunDisclosureEnabled={isRunDisclosureEnabled}
                            isRunAdaptationOpportunitiesAnalysisEnabled={
                                isRunAdaptationOpportunitiesAnalysisEnabled
                            }
                            isMockPortfolio={isMockPortfolio}
                            data-testid="edit-settings-primary-info"
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 4,
                            }}
                        >
                            <AnalysisTypeSelection
                                type={formik.values.type}
                                onTypeChange={handleTypeChange}
                                showChangeTypeOption={showChangeTypeOption}
                                changeType={formik.values.changeAnalysisType}
                                onChangeTypeChange={handleChangeTypeChange}
                                data-testid="edit-settings-analysis-type"
                            />

                            <AdditionalAnalyses
                                isRunDisclosureEnabled={isRunDisclosureEnabled}
                                isRunAdaptationOpportunitiesAnalysisEnabled={
                                    isRunAdaptationOpportunitiesAnalysisEnabled
                                }
                                data-testid="edit-settings-additional-analyses"
                            />
                        </Box>
                    </Box>
                </Container>

                <Divider />

                <Container>
                    <Box
                        py={5}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            alignSelf: 'stretch',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                width: '100%',
                                justifyContent:
                                    formik.values.type === AnalysisType.Custom
                                        ? 'space-between'
                                        : 'flex-start',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    data-testid="data-settings-label"
                                >
                                    Data Settings
                                </Typography>
                                {formik.errors.hasAtLeastOneResultSet && (
                                    <FormHelperText
                                        sx={{
                                            color: theme.palette.error.light,
                                        }}
                                    >
                                        {formik.errors.hasAtLeastOneResultSet}
                                    </FormHelperText>
                                )}
                            </Box>

                            {formik.values.type === AnalysisType.Custom ? (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleChangeTypeToDefault}
                                    data-testid="restore-defaults-button"
                                >
                                    Restore Defaults
                                </Button>
                            ) : (
                                customizeButton
                            )}
                        </Box>

                        {formik.values.changeAnalysisType ? (
                            formik.values.type === AnalysisType.Custom ? (
                                <CustomDataSettingsForm />
                            ) : (
                                <DataSettingsForm />
                            )
                        ) : (
                            currentPortfolioWithResultSets && (
                                <PortfolioInfo
                                    portfolio={currentPortfolioWithResultSets}
                                />
                            )
                        )}
                    </Box>
                </Container>
            </Box>
        </FormikProvider>
    );
};
