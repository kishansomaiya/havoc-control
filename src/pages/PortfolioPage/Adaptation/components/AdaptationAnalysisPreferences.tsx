import {
    Dispatch,
    FC,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import {
    useFormatMessage,
    MessageKeys,
} from '../../../../localization/useFormatMessage';
import { Button, Stack } from '@mui/material';
import { AdaptationStepsType } from '../adaptationSteps';
import {
    AdaptationAnalysisSettingsInvestmentHorizonEnum,
    AnalysisSettingsWithMetadataResponse,
} from '../../../../api/openapi/auto-generated';
import { usePostAdaptationAnalysisSettings } from '../../../../api/queries/adaptationQueries';
import { find, map } from 'lodash';
import { percentFormatter } from '../../../../utils';
import { LoadingButton } from '@mui/lab';

type GrowthFactorTypes = 'none' | 'asset' | 'custom';
const GrowthFactors: { value: GrowthFactorTypes; label: MessageKeys }[] = [
    { value: 'none', label: 'adaptation.analysis.growth_factor.none' },
    { value: 'asset', label: 'adaptation.analysis.growth_factor.asset' },
    { value: 'custom', label: 'adaptation.analysis.growth_factor.custom' },
];

type DiscountRateTypes = 'none' | 'asset' | 'custom';
const DiscountRateTypes: { value: DiscountRateTypes; label: MessageKeys }[] = [
    { value: 'none', label: 'adaptation.analysis.discount_rate.none' },
    { value: 'asset', label: 'adaptation.analysis.discount_rate.asset' },
    { value: 'custom', label: 'adaptation.analysis.discount_rate.custom' },
];

type InterruptionTypes = 'true' | 'false';
const InterruptionOptions: { value: InterruptionTypes; label: MessageKeys }[] =
    [
        { value: 'true', label: 'adaptation.analysis.interruptions.yes' },
        { value: 'false', label: 'adaptation.analysis.interruptions.no' },
    ];

type CostRangeTypes = 'lower' | 'middle' | 'upper' | 'custom';
const CostRanges: {
    value: CostRangeTypes;
    label: MessageKeys;
    numeric?: number;
}[] = [
    {
        value: 'lower',
        label: 'adaptation.analysis.cost_range.lower',
        numeric: 0.8,
    },
    {
        value: 'middle',
        label: 'adaptation.analysis.cost_range.middle',
        numeric: 1,
    },
    {
        value: 'upper',
        label: 'adaptation.analysis.cost_range.upper',
        numeric: 1.35,
    },
    { value: 'custom', label: 'adaptation.analysis.cost_range.custom' },
];

// Perils
type PerilTypes = 'combinedFlood' | 'wind' | 'fire' | 'heat';
const Perils: { value: PerilTypes; label: MessageKeys }[] = [
    { value: 'combinedFlood', label: 'adaptation.analysis.perils.flood' },
    { value: 'wind', label: 'adaptation.analysis.perils.wind' },
    { value: 'fire', label: 'adaptation.analysis.perils.wildfire' },
    { value: 'heat', label: 'adaptation.analysis.perils.heat' },
];

// Emissions
type EmissionTypes = 'ssp126' | 'ssp245' | 'ssp585';
const Emissions: { value: EmissionTypes; label: MessageKeys }[] = [
    { value: 'ssp126', label: 'adaptation.analysis.emissions.ssp1' },
    { value: 'ssp245', label: 'adaptation.analysis.emissions.ssp2' },
    { value: 'ssp585', label: 'adaptation.analysis.emissions.ssp5' },
];

// Horizons
type HorizonTypes = '5' | '10' | '20' | '30';
const Horizons: { value: HorizonTypes; label: MessageKeys }[] = [
    { value: '5', label: 'adaptation.analysis.horizon.5' },
    { value: '10', label: 'adaptation.analysis.horizon.10' },
    { value: '20', label: 'adaptation.analysis.horizon.20' },
    { value: '30', label: 'adaptation.analysis.horizon.30' },
];

type PreferenceSectionProps = PropsWithChildren<{
    labelKey: MessageKeys;
    description?: MessageKeys;
}>;

const PreferenceSection: FC<PreferenceSectionProps> = ({
    labelKey,
    description,
    children,
}) => {
    const formatMessage = useFormatMessage();
    return (
        <Box>
            <Typography
                variant="h3"
                fontSize={16}
                fontWeight="bold"
                sx={{ mb: 1 }}
            >
                {formatMessage(labelKey)}
            </Typography>
            {description && (
                <Typography
                    variant="body2"
                    sx={{ mb: 2, color: '#8D9498' }}
                >
                    {formatMessage(description)}
                </Typography>
            )}
            <Box sx={{ paddingX: 1 }}>{children}</Box>
        </Box>
    );
};

function isValidNumber(val: string): boolean {
    return /^\d*$/.test(val);
}

type AnalysisPreferenceType = {
    selectedPerils: PerilTypes[];
    emissions: EmissionTypes;
    interruptions: InterruptionTypes;
    costRange: CostRangeTypes;
    customCostRange: string;
    horizon: HorizonTypes;
    discountRateType: DiscountRateTypes;
    customDiscountRate: string;
    growthFactorType: GrowthFactorTypes;
    customGrowthFactor: string;
};

const DEFAULT_SETTINGS: AnalysisPreferenceType = {
    selectedPerils: map(Perils, 'value'),
    emissions: 'ssp585',
    interruptions: 'true',
    costRange: 'middle',
    customCostRange: '',
    horizon: '10',
    discountRateType: 'none',
    customDiscountRate: '',
    growthFactorType: 'none',
    customGrowthFactor: '',
};

export const AdaptationAnalysisPreferences: FC<{
    setView: Dispatch<SetStateAction<AdaptationStepsType>>;
    analysisSettings?: AnalysisSettingsWithMetadataResponse;
    analysisId?: string;
}> = ({ setView, analysisSettings: analysisSettingsData, analysisId }) => {
    const formatMessage = useFormatMessage();
    const {
        mutateAsync: postAdaptationAnalysisSettings,
        isPending: isPostAdaptationAnlysisSettingsPending,
    } = usePostAdaptationAnalysisSettings(analysisId ?? '');

    const [preferences, setPreferences] =
        useState<AnalysisPreferenceType>(DEFAULT_SETTINGS);

    useEffect(() => {
        const analysisSettings = analysisSettingsData?.analysisSettings;
        if (!analysisSettings) return;
        const getRateType = (val: number | null | undefined) => {
            if (val === null) return 'asset';
            if (val === 0 || val === undefined) return 'none';
            return 'custom';
        };
        const costRangeIndex = CostRanges.findIndex(
            ({ numeric }) =>
                numeric === analysisSettings?.adaptationUnitCostRange
        );
        const costRange =
            costRangeIndex !== -1 ? CostRanges[costRangeIndex].value : 'custom';

        const updatedValues: Partial<AnalysisPreferenceType> = {
            selectedPerils: (analysisSettings?.perils as PerilTypes[]) ?? [],
            emissions:
                (analysisSettings?.emissionsScenario as EmissionTypes) ??
                'ssp126',
            interruptions: analysisSettings?.includeBusinessInterruption
                ? 'true'
                : 'false',
            horizon:
                (analysisSettings?.investmentHorizon?.toString() as HorizonTypes) ??
                '10',
            discountRateType: getRateType(analysisSettings?.discountRate),
            growthFactorType: getRateType(analysisSettings?.growthFactor),
            costRange,
        };

        if (updatedValues.discountRateType === 'custom') {
            updatedValues.customDiscountRate = (
                (analysisSettings.discountRate ?? 0) * 100
            ).toString();
        }
        if (updatedValues.growthFactorType === 'custom') {
            updatedValues.customGrowthFactor = (
                (analysisSettings.growthFactor ?? 0) * 100
            ).toString();
        }
        if (updatedValues.costRange === 'custom') {
            updatedValues.customCostRange = (
                (analysisSettings.adaptationUnitCostRange ?? 0) * 100
            ).toString();
        }

        setPreferences((prev) => ({
            ...prev,
            ...updatedValues,
        }));
    }, [analysisSettingsData]);

    const updatePreference = useCallback(
        <K extends keyof AnalysisPreferenceType>(
            key: K,
            value: AnalysisPreferenceType[K]
        ) => {
            setPreferences((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleBack = useCallback(() => {
        setView(
            analysisSettingsData?.settingsConfirmed
                ? 'visualizations'
                : 'assetSelection'
        );
    }, [setView, analysisSettingsData]);

    const handleSave = useCallback(() => {
        let costRange = find(CostRanges, [
            'value',
            preferences.costRange,
        ])?.numeric;
        if (costRange === undefined) {
            const val = parseInt(preferences.customCostRange);
            costRange = !Number.isNaN(val) ? val / 100 : 0; // Divided by 100 to convert to float percentage
        }

        let discountRate: number | null = 0;
        if (preferences.discountRateType === 'asset') {
            discountRate = null;
        }
        if (preferences.discountRateType === 'custom') {
            const val = parseInt(preferences.customDiscountRate);
            discountRate = !Number.isNaN(val) ? val / 100 : 0; // Divided by 100 to convert to float percentage
        }

        let growthFactor: number | null = 0;
        if (preferences.growthFactorType === 'asset') {
            growthFactor = null;
        }
        if (preferences.growthFactorType === 'custom') {
            const val = parseFloat(preferences.customGrowthFactor);
            growthFactor = !Number.isNaN(val) ? val / 100 : 0; // Divided by 100 to convert to float percentage
        }

        postAdaptationAnalysisSettings({
            analysisSettings: {
                perils: preferences.selectedPerils,
                emissionsScenario: preferences.emissions,
                investmentHorizon: parseInt(
                    preferences.horizon
                ) as AdaptationAnalysisSettingsInvestmentHorizonEnum,
                includeBusinessInterruption:
                    preferences.interruptions === 'true',
                adaptationUnitCostRange: costRange,
                discountRate,
                growthFactor,
            },
            settingsConfirmed: true,
        }).then(() => {
            setView('visualizations');
        });
    }, [preferences, postAdaptationAnalysisSettings, setView]);

    return (
        <Box
            data-testid="adaptation-analysis-preferences-body"
            sx={{ mx: 4 }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
                mt={2}
            >
                <Typography
                    variant="h1"
                    fontSize={32}
                    fontWeight="bold"
                    sx={{ mb: 4 }}
                    data-testid="adaptation-analysis-title"
                >
                    {formatMessage('adaptation.analysis.title')}
                </Typography>
                <Stack
                    direction={'row'}
                    gap={2}
                    sx={{ mt: 4 }}
                >
                    <Button
                        variant="outlined"
                        sx={{ px: 4 }}
                        data-testid="adaptation-analysis-back-btn"
                        onClick={handleBack}
                        disabled={isPostAdaptationAnlysisSettingsPending}
                    >
                        {formatMessage('adaptation.analysis.back')}
                    </Button>
                    <LoadingButton
                        loading={isPostAdaptationAnlysisSettingsPending}
                        variant="contained"
                        color="secondary"
                        sx={{ px: 4 }}
                        data-testid="adaptation-analysis-save-btn"
                        onClick={handleSave}
                    >
                        {formatMessage('adaptation.analysis.save')}
                    </LoadingButton>
                </Stack>
            </Stack>

            <Stack
                spacing={2}
                overflow={'scroll'}
                height={'calc(100vh - 305px)'}
            >
                <PreferenceSection
                    labelKey="adaptation.analysis.perils.label"
                    description="adaptation.analysis.perils.description"
                >
                    <FormGroup
                        row
                        data-testid="adaptation-analysis-perils-group"
                    >
                        {Perils.map((peril) => (
                            <FormControlLabel
                                key={peril.value}
                                control={
                                    <Checkbox
                                        checked={preferences.selectedPerils.includes(
                                            peril.value
                                        )}
                                        onChange={() => {
                                            updatePreference(
                                                'selectedPerils',
                                                preferences.selectedPerils.includes(
                                                    peril.value
                                                )
                                                    ? preferences.selectedPerils.filter(
                                                          (p) =>
                                                              p !== peril.value
                                                      )
                                                    : [
                                                          ...preferences.selectedPerils,
                                                          peril.value,
                                                      ]
                                            );
                                        }}
                                        sx={{ color: '#fff' }}
                                        color="secondary"
                                        data-testid={`adaptation-analysis-peril-checkbox-${peril.value}`}
                                    />
                                }
                                label={formatMessage(peril.label)}
                            />
                        ))}
                    </FormGroup>
                </PreferenceSection>
                <PreferenceSection
                    labelKey="adaptation.analysis.emissions.label"
                    description="adaptation.analysis.emissions.description"
                >
                    <RadioGroup
                        row
                        value={preferences.emissions}
                        onChange={(e) =>
                            updatePreference(
                                'emissions',
                                e.target.value as EmissionTypes
                            )
                        }
                        data-testid="adaptation-analysis-emissions-group"
                    >
                        {Emissions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        sx={{ color: '#fff' }}
                                        color="secondary"
                                        data-testid={`adaptation-analysis-emission-radio-${option.value}`}
                                    />
                                }
                                label={formatMessage(option.label)}
                            />
                        ))}
                    </RadioGroup>
                </PreferenceSection>
                <PreferenceSection
                    labelKey="adaptation.analysis.interruptions.label"
                    description="adaptation.analysis.interruptions.description"
                >
                    <RadioGroup
                        row
                        value={preferences.interruptions}
                        onChange={(e) =>
                            updatePreference(
                                'interruptions',
                                e.target.value as InterruptionTypes
                            )
                        }
                    >
                        {InterruptionOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        sx={{ color: '#fff' }}
                                        color="secondary"
                                    />
                                }
                                label={formatMessage(option.label)}
                            />
                        ))}
                    </RadioGroup>
                </PreferenceSection>
                <PreferenceSection
                    labelKey="adaptation.analysis.cost_range.label"
                    description="adaptation.analysis.cost_range.description"
                >
                    <RadioGroup
                        row
                        value={preferences.costRange}
                        onChange={(e) =>
                            updatePreference(
                                'costRange',
                                e.target.value as CostRangeTypes
                            )
                        }
                    >
                        {CostRanges.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        sx={{ color: '#fff' }}
                                        color="secondary"
                                        data-testid={
                                            option.value === 'custom'
                                                ? 'adaptation-analysis-cost_range-custom-radio'
                                                : undefined
                                        }
                                    />
                                }
                                label={formatMessage(option.label)}
                            />
                        ))}
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            minHeight={'45px'}
                        >
                            {preferences.costRange === 'custom' && (
                                <TextField
                                    value={preferences.customCostRange}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isValidNumber(val))
                                            updatePreference(
                                                'customCostRange',
                                                val
                                            );
                                    }}
                                    inputProps={{ step: 0.01 }}
                                    color="secondary"
                                    sx={{
                                        input: { color: '#fff' },
                                        width: 300,
                                    }}
                                    placeholder={formatMessage(
                                        'adaptation.analysis.cost_range.custom_placeholder'
                                    )}
                                    data-testid="adaptation-analysis-cost_range-custom-input"
                                />
                            )}
                        </Box>
                    </RadioGroup>
                </PreferenceSection>
                <PreferenceSection
                    labelKey="adaptation.analysis.horizon.label"
                    description="adaptation.analysis.horizon.description"
                >
                    <RadioGroup
                        row
                        value={preferences.horizon}
                        onChange={(e) =>
                            updatePreference(
                                'horizon',
                                e.target.value as HorizonTypes
                            )
                        }
                    >
                        {Horizons.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        sx={{ color: '#fff' }}
                                        color="secondary"
                                    />
                                }
                                label={formatMessage(option.label)}
                            />
                        ))}
                    </RadioGroup>
                </PreferenceSection>
                <PreferenceSection
                    labelKey="adaptation.analysis.discount_rate.label"
                    description="adaptation.analysis.discount_rate.description"
                >
                    <RadioGroup
                        row
                        value={preferences.discountRateType}
                        onChange={(e) =>
                            updatePreference(
                                'discountRateType',
                                e.target.value as DiscountRateTypes
                            )
                        }
                    >
                        {DiscountRateTypes.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        sx={{ color: '#fff' }}
                                        color="secondary"
                                        data-testid={`adaptation-analysis-discount_rate-${option.value}-radio`}
                                    />
                                }
                                label={formatMessage(option.label, {
                                    min: percentFormatter(
                                        analysisSettingsData?.discountRate
                                            ?.min ?? 0
                                    ),
                                    max: percentFormatter(
                                        analysisSettingsData?.discountRate
                                            ?.max ?? 0
                                    ),
                                })}
                            />
                        ))}
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            minHeight={'45px'}
                        >
                            {preferences.discountRateType === 'custom' && (
                                <TextField
                                    value={preferences.customDiscountRate}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isValidNumber(val))
                                            updatePreference(
                                                'customDiscountRate',
                                                val
                                            );
                                    }}
                                    inputProps={{ step: 0.01 }}
                                    color="secondary"
                                    sx={{
                                        input: { color: '#fff' },
                                        width: 300,
                                    }}
                                    placeholder={formatMessage(
                                        'adaptation.analysis.discount_rate.custom_placeholder'
                                    )}
                                    data-testid="adaptation-analysis-discount_rate-custom-input"
                                />
                            )}
                        </Box>
                    </RadioGroup>
                </PreferenceSection>
                <PreferenceSection
                    labelKey="adaptation.analysis.growth_factor.label"
                    description="adaptation.analysis.growth_factor.description"
                >
                    <RadioGroup
                        row
                        value={preferences.growthFactorType}
                        onChange={(e) =>
                            updatePreference(
                                'growthFactorType',
                                e.target.value as GrowthFactorTypes
                            )
                        }
                    >
                        {GrowthFactors.map(({ value, label }) => (
                            <FormControlLabel
                                key={value}
                                value={value}
                                control={
                                    <Radio
                                        sx={{ color: '#fff' }}
                                        color="secondary"
                                    />
                                }
                                label={formatMessage(label, {
                                    min: percentFormatter(
                                        analysisSettingsData?.annualGrowth
                                            ?.min ?? 0
                                    ),
                                    max: percentFormatter(
                                        analysisSettingsData?.annualGrowth
                                            ?.max ?? 0
                                    ),
                                })}
                                data-testid={`adaptation-analysis-growth_factor-${value}-radio`}
                            />
                        ))}
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            minHeight={'45px'}
                        >
                            {preferences.growthFactorType === 'custom' && (
                                <TextField
                                    value={preferences.customGrowthFactor}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isValidNumber(val))
                                            updatePreference(
                                                'customGrowthFactor',
                                                val
                                            );
                                    }}
                                    inputProps={{ step: 0.1 }}
                                    color="secondary"
                                    sx={{
                                        input: { color: '#fff' },
                                        width: 300,
                                    }}
                                    placeholder={formatMessage(
                                        'adaptation.analysis.growth_factor.custom_placeholder'
                                    )}
                                    data-testid="adaptation-analysis-growth_factor-custom-input"
                                />
                            )}
                        </Box>
                    </RadioGroup>
                </PreferenceSection>
            </Stack>
        </Box>
    );
};
