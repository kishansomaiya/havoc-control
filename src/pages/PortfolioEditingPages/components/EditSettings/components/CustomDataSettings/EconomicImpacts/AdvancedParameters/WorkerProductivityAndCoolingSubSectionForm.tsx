import {
    ChangeEvent,
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import {
    Autocomplete,
    Box,
    Checkbox,
    FormControlLabel,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import {
    DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS,
    ECONOMIC_IMPACT_DISABLED_OPTIONS,
} from '../../../../../../../../const';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import {
    WORK_INTENSITY_VALUES,
    WorkIntensity,
    workIntensityTitle,
} from '../../../../../../../../types/workIntensityEnum';
import { FormPriceTextField } from '../../../../../../../../components/Inputs/FormPriceTextField';
import { FormNumberTextField } from '../../../../../../../../components/Inputs/FormNumberTextField';
import { GridField } from '../../../GridField';
import { GridFieldSet } from '../../../GridFieldSet';
import { SubSection } from '../../../SubSection';
import { IPortfolio } from '../../../../../../types/portfolio';
import { Peril } from '../../../../../../../../types';
import { Info } from 'react-feather';
import { isNil } from 'lodash';

interface WorkIntensityOption {
    id: WorkIntensity | null;
    title: string;
}

interface WorkerProductivityAndCoolingSubSectionFormProps
    extends ComponentProps<typeof Box> {}

export const WorkerProductivityAndCoolingSubSectionForm: FC<
    WorkerProductivityAndCoolingSubSectionFormProps
> = ({ ...props }) => {
    const theme = useTheme();
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const { advancedParameters } = custom.economicImpacts;

    const { includeWorkerProductivity, includeCostOfCooling } =
        advancedParameters;

    const { workIntensity } = advancedParameters.workerProductivity;
    const { electricityCostUsd } = advancedParameters.costOfCooling;
    const { coolingSystemProbability } =
        advancedParameters.workerProductivityOrCostOfCooling;

    const workerProductivityOrCostOfCoolingtouched =
        formik.touched.custom?.economicImpacts?.advancedParameters
            ?.workerProductivityOrCostOfCooling;
    const costOfCoolingtouched =
        formik.touched.custom?.economicImpacts?.advancedParameters
            ?.costOfCooling;

    const workerProductivityOrCostOfCoolingErrors =
        formik.errors.custom?.economicImpacts?.advancedParameters
            ?.workerProductivityOrCostOfCooling;
    const costOfCoolingErrors =
        formik.errors.custom?.economicImpacts?.advancedParameters
            ?.costOfCooling;

    const disabled = ECONOMIC_IMPACT_DISABLED_OPTIONS[dataVersion];
    const additionalOptions =
        DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS[dataVersion];

    const electricityCostUsdError = costOfCoolingErrors?.electricityCostUsd;
    const isElectricityCostUsdError =
        costOfCoolingtouched?.electricityCostUsd &&
        electricityCostUsdError !== undefined;

    const coolingSystemProbabilityError =
        workerProductivityOrCostOfCoolingErrors?.coolingSystemProbability;
    const isCoolingSystemProbabilityError =
        workerProductivityOrCostOfCoolingtouched?.coolingSystemProbability &&
        coolingSystemProbabilityError !== undefined;

    const hasHeatInPerils = useMemo(() => {
        return custom.perilMetrics.perils.includes(Peril.Heat) ?? false;
    }, [custom.perilMetrics.perils]);

    const isWPAndCoCDisabled = useMemo(
        () =>
            additionalOptions.includeWorkerProductivity.disabled ||
            additionalOptions.includeCostOfCooling.disabled ||
            !hasHeatInPerils,
        [
            additionalOptions.includeWorkerProductivity.disabled,
            additionalOptions.includeCostOfCooling.disabled,
            hasHeatInPerils,
        ]
    );

    const handleIncludeWorkerProductivityChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField(
                'custom.economicImpacts.advancedParameters.includeWorkerProductivity',
                event.target.checked
            );
        },
        [setField]
    );

    const handleIncludeCostOfCoolingChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField(
                'custom.economicImpacts.advancedParameters.includeCostOfCooling',
                event.target.checked
            );
        },
        [setField]
    );

    const checkScenarioSSP245AndYear2020PresentForWP = useMemo(() => {
        const hasSSP245 =
            custom.perilMetrics.scenarios.includes('ssp245') ?? false;

        const has2020Year = custom.perilMetrics.years.includes(2020);

        return hasSSP245 && has2020Year;
    }, [custom.perilMetrics.years, custom.perilMetrics.scenarios]);

    useEffect(() => {
        setField(
            'custom.economicImpacts.advancedParameters.includeWorkerProductivity',
            hasHeatInPerils && checkScenarioSSP245AndYear2020PresentForWP
        );
        setField(
            'custom.economicImpacts.advancedParameters.includeCostOfCooling',
            hasHeatInPerils
        );
    }, [checkScenarioSSP245AndYear2020PresentForWP, hasHeatInPerils, setField]);

    const {
        workIntensityOptions,
        selectedWorkIntensityOption,
        handleSelectedWorkIntensityChange,
        handleGetWorkIntensityKey,
        handleGetWorkIntensityTitle,
    } = useWorkIntensity(workIntensity ?? null);

    return (
        <SubSection
            {...props}
            heading={
                <Box
                    display={'flex'}
                    alignItems="center"
                    gap={theme.spacing(1)}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="secondary"
                                checked={includeCostOfCooling}
                                onChange={handleIncludeCostOfCoolingChange}
                            />
                        }
                        label={
                            <Typography
                                display="flex"
                                alignItems="center"
                                gap={theme.spacing(0.5)}
                                color={
                                    isWPAndCoCDisabled
                                        ? theme.palette.text.secondary
                                        : ''
                                }
                            >
                                Include Cost of Cooling
                                {(isNil(hasHeatInPerils) ||
                                    !hasHeatInPerils) && (
                                    <Tooltip
                                        title='If you wish to include the Economic Impact of cost of cooling, you must first select "Heat" in your list of Perils (above).'
                                        arrow
                                        placement="bottom-start"
                                    >
                                        <Info size="0.8rem" />
                                    </Tooltip>
                                )}
                            </Typography>
                        }
                        disabled={isWPAndCoCDisabled}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="secondary"
                                checked={includeWorkerProductivity}
                                onChange={handleIncludeWorkerProductivityChange}
                            />
                        }
                        label={
                            <Typography
                                display="flex"
                                alignItems="center"
                                gap={theme.spacing(0.5)}
                                color={
                                    isWPAndCoCDisabled ||
                                    !checkScenarioSSP245AndYear2020PresentForWP
                                        ? theme.palette.text.secondary
                                        : ''
                                }
                            >
                                Include Worker Productivity
                                {(isNil(hasHeatInPerils) ||
                                    !hasHeatInPerils ||
                                    isNil(
                                        checkScenarioSSP245AndYear2020PresentForWP
                                    ) ||
                                    !checkScenarioSSP245AndYear2020PresentForWP) && (
                                    <Tooltip
                                        title={
                                            !hasHeatInPerils
                                                ? 'If you wish to include the Economic Impact of worker productivity, you must first select "Heat" in your list of Perils (above).'
                                                : 'Scenario SSP2-4.5 and year 2020 must be selected in order to run this module'
                                        }
                                        arrow
                                        placement="bottom-start"
                                    >
                                        <Info size="0.8rem" />
                                    </Tooltip>
                                )}
                            </Typography>
                        }
                        disabled={
                            isWPAndCoCDisabled ||
                            !checkScenarioSSP245AndYear2020PresentForWP
                        }
                    />
                </Box>
            }
        >
            <GridFieldSet>
                <GridField>
                    <FormPriceTextField
                        name="custom.economicImpacts.advancedParameters.costOfCooling.electricityCostUsd"
                        label="Electricity Cost"
                        placeholder="Enter Value"
                        value={electricityCostUsd}
                        setField={setField}
                        fullWidth
                        disabled={
                            disabled.electricityCostUsd || !includeCostOfCooling
                        }
                        error={isElectricityCostUsdError}
                        helperText={
                            isElectricityCostUsdError
                                ? electricityCostUsdError
                                : 'USD per kWh'
                        }
                    />
                </GridField>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.advancedParameters.workerProductivityOrCostOfCooling.coolingSystemProbability"
                        label="Cooling System Probability"
                        value={coolingSystemProbability}
                        setField={setField}
                        placeholder="Enter Value"
                        fullWidth
                        disabled={
                            disabled.coolingSystemProbability ||
                            !(includeWorkerProductivity || includeCostOfCooling)
                        }
                        error={isCoolingSystemProbabilityError}
                        helperText={
                            isCoolingSystemProbabilityError
                                ? coolingSystemProbabilityError
                                : 'Set to 0 if not present, 1 if present, or somewhere in between. Leave blank to have a probability assigned'
                        }
                    />
                </GridField>
                <GridField>
                    <Autocomplete
                        options={workIntensityOptions}
                        disableClearable
                        freeSolo={false}
                        value={selectedWorkIntensityOption}
                        onChange={handleSelectedWorkIntensityChange}
                        getOptionKey={handleGetWorkIntensityKey}
                        getOptionLabel={handleGetWorkIntensityTitle}
                        renderInput={({ inputProps, ...params }) => (
                            <TextField
                                {...params}
                                label="Work Intensity"
                                placeholder="Enter Value"
                                variant="outlined"
                                inputProps={{
                                    ...inputProps,
                                    readOnly: true,
                                }}
                            />
                        )}
                        fullWidth
                        disabled={
                            disabled.workIntensity || !includeWorkerProductivity
                        }
                    />
                </GridField>
            </GridFieldSet>
        </SubSection>
    );
};

function useWorkIntensity(workIntensity: WorkIntensity | null) {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;

    const workIntensityOptions = useMemo<WorkIntensityOption[]>(() => {
        const result: WorkIntensityOption[] =
            WORK_INTENSITY_VALUES.map((id) => ({
                id,
                title: workIntensityTitle(id),
            })) ?? [];
        return result;
    }, []);

    const selectedWorkIntensityOption = useMemo(
        () =>
            workIntensityOptions?.find((value) => value.id === workIntensity) ??
            workIntensityOptions[0],
        [workIntensity, workIntensityOptions]
    );

    const handleSelectedWorkIntensityChange = useCallback(
        async (
            _event: SyntheticEvent,
            newValue: WorkIntensityOption | null
        ) => {
            const id = newValue?.id;
            await setField(
                'custom.economicImpacts.advancedParameters.workerProductivity.workIntensity',
                id ?? undefined
            );
        },
        [setField]
    );

    const handleGetWorkIntensityKey = useCallback(
        (option: WorkIntensityOption) => {
            return String(option.id);
        },
        []
    );

    const handleGetWorkIntensityTitle = useCallback(
        (option: WorkIntensityOption) => {
            return option.title;
        },
        []
    );

    return {
        workIntensityOptions,
        selectedWorkIntensityOption,
        handleSelectedWorkIntensityChange,
        handleGetWorkIntensityKey,
        handleGetWorkIntensityTitle,
    };
}
