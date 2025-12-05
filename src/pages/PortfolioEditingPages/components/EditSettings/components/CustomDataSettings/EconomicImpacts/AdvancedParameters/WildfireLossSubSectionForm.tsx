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
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import {
    DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS,
    ECONOMIC_IMPACT_DISABLED_OPTIONS,
} from '../../../../../../../../const';
import {
    WINDOW_PANE_VALUES,
    WindowPane,
    windowPaneTitle,
} from '../../../../../../../../types/windowPaneEnum';
import {
    VENT_TYPE_VALUES,
    VentType,
    ventTypeTitle,
} from '../../../../../../../../types/ventTypeEnum';
import {
    ROOF_COVER_VALUES,
    RoofCover,
    roofCoverTitle,
} from '../../../../../../../../types/roofCoverEnum';
import { GridField } from '../../../GridField';
import { GridFieldSet } from '../../../GridFieldSet';
import { SubSection } from '../../../SubSection';
import { IPortfolio } from '../../../../../../types/portfolio';
import { Peril } from '../../../../../../../../types';
import { Info } from 'react-feather';

interface WindowPaneOption {
    id: WindowPane | null;
    title: string;
}

interface VentTypeOption {
    id: VentType | null;
    title: string;
}

interface RoofCoverOption {
    id: RoofCover | null;
    title: string;
}

interface WildfireLossSubSectionFormProps extends ComponentProps<typeof Box> {}

export const WildfireLossSubSectionForm: FC<
    WildfireLossSubSectionFormProps
> = ({ ...props }) => {
    const theme = useTheme();
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const { advancedParameters } = custom.economicImpacts;
    const { includeWildfireLoss } = advancedParameters;
    const { windowPane, ventType, roofCover } = advancedParameters.wildfireLoss;

    const disabled = ECONOMIC_IMPACT_DISABLED_OPTIONS[dataVersion];
    const additionalOptions =
        DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS[dataVersion];

    const checkWildfireLossEnabled = useMemo(() => {
        const hasWildfireInPerils =
            custom.perilMetrics.perils.includes(Peril.Fire) ?? false;

        return hasWildfireInPerils;
    }, [custom.perilMetrics.perils]);

    const isWildfireDisabled = useMemo(
        () =>
            additionalOptions.includeWildfireLoss.disabled ||
            !checkWildfireLossEnabled,
        [
            additionalOptions.includeWildfireLoss.disabled,
            checkWildfireLossEnabled,
        ]
    );

    const handleIncludeChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField(
                'custom.economicImpacts.advancedParameters.includeWildfireLoss',
                event.target.checked
            );
        },
        [setField]
    );

    useEffect(() => {
        setField(
            'custom.economicImpacts.advancedParameters.includeWildfireLoss',
            checkWildfireLossEnabled
        );
    }, [checkWildfireLossEnabled, setField]);

    const {
        windowPaneOptions,
        selectedWindowPaneOption,
        handleSelectedWindowPaneChange,
        handleGetWindowPaneKey,
        handleGetWindowPaneTitle,
    } = useWindowPane(windowPane ?? null);

    const {
        ventTypeOptions,
        selectedVentTypeOption,
        handleSelectedVentTypeChange,
        handleGetVentTypeKey,
        handleGetVentTypeTitle,
    } = useVentType(ventType ?? null);

    const {
        roofCoverOptions,
        selectedRoofCoverOption,
        handleSelectedRoofCoverChange,
        handleGetRoofCoverKey,
        handleGetRoofCoverTitle,
    } = useRoofCover(roofCover ?? null);

    return (
        <SubSection
            {...props}
            heading={
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            checked={includeWildfireLoss}
                            onChange={handleIncludeChange}
                        />
                    }
                    label={
                        <Typography
                            display="flex"
                            alignItems="center"
                            gap={theme.spacing(0.5)}
                            color={
                                isWildfireDisabled
                                    ? theme.palette.text.secondary
                                    : ''
                            }
                        >
                            Include Wildfire Loss
                            {!checkWildfireLossEnabled && (
                                <Tooltip
                                    title="If you wish to include the Economic Impact of Wildfire Loss, you must first select “Wildfire” in your list of Perils (above)."
                                    arrow
                                    placement="bottom-start"
                                >
                                    <Info size="0.8rem" />
                                </Tooltip>
                            )}
                        </Typography>
                    }
                    disabled={isWildfireDisabled}
                />
            }
        >
            <GridFieldSet>
                <GridField>
                    <Autocomplete
                        options={windowPaneOptions}
                        disableClearable
                        freeSolo={false}
                        value={selectedWindowPaneOption}
                        onChange={handleSelectedWindowPaneChange}
                        getOptionKey={handleGetWindowPaneKey}
                        getOptionLabel={handleGetWindowPaneTitle}
                        renderInput={({ inputProps, ...params }) => (
                            <TextField
                                {...params}
                                label="Window Pane"
                                placeholder="Enter Value"
                                variant="outlined"
                                inputProps={{
                                    ...inputProps,
                                    readOnly: true,
                                }}
                                helperText="Type of window construction (single-pane, multi-pane, or none)."
                            />
                        )}
                        fullWidth
                        disabled={disabled.windowPane || !includeWildfireLoss}
                    />
                </GridField>
                <GridField>
                    <Autocomplete
                        options={ventTypeOptions}
                        disableClearable
                        freeSolo={false}
                        value={selectedVentTypeOption}
                        onChange={handleSelectedVentTypeChange}
                        getOptionKey={handleGetVentTypeKey}
                        getOptionLabel={handleGetVentTypeTitle}
                        renderInput={({ inputProps, ...params }) => (
                            <TextField
                                {...params}
                                label="Vent Type"
                                placeholder="Enter Value"
                                variant="outlined"
                                inputProps={{
                                    ...inputProps,
                                    readOnly: true,
                                }}
                                helperText="The type of exterior vents (attic and basement). See Input Data Guidance for more details."
                            />
                        )}
                        fullWidth
                        disabled={disabled.ventType || !includeWildfireLoss}
                    />
                </GridField>
                <GridField>
                    <Autocomplete
                        options={roofCoverOptions}
                        disableClearable
                        freeSolo={false}
                        value={selectedRoofCoverOption}
                        onChange={handleSelectedRoofCoverChange}
                        getOptionKey={handleGetRoofCoverKey}
                        getOptionLabel={handleGetRoofCoverTitle}
                        renderInput={({ inputProps, ...params }) => (
                            <TextField
                                {...params}
                                label="Roof Cover"
                                placeholder="Enter Value"
                                variant="outlined"
                                inputProps={{
                                    ...inputProps,
                                    readOnly: true,
                                }}
                                helperText="The top layer of roofing material (wood or other)."
                            />
                        )}
                        fullWidth
                        disabled={disabled.roofCover || !includeWildfireLoss}
                    />
                </GridField>
            </GridFieldSet>
        </SubSection>
    );
};

function useWindowPane(windowPane: WindowPane | null) {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;

    const windowPaneOptions = useMemo<WindowPaneOption[]>(() => {
        const result: WindowPaneOption[] =
            WINDOW_PANE_VALUES.map((id) => ({
                id,
                title: windowPaneTitle(id),
            })) ?? [];
        return result;
    }, []);

    const selectedWindowPaneOption = useMemo(
        () =>
            windowPaneOptions?.find((value) => value.id === windowPane) ??
            windowPaneOptions[0],
        [windowPane, windowPaneOptions]
    );

    const handleSelectedWindowPaneChange = useCallback(
        async (_event: SyntheticEvent, newValue: WindowPaneOption | null) => {
            const id = newValue?.id;
            await setField(
                'custom.economicImpacts.advancedParameters.wildfireLoss.windowPane',
                id ?? undefined
            );
        },
        [setField]
    );

    const handleGetWindowPaneKey = useCallback((option: WindowPaneOption) => {
        return String(option.id);
    }, []);

    const handleGetWindowPaneTitle = useCallback((option: WindowPaneOption) => {
        return option.title;
    }, []);

    return {
        windowPaneOptions,
        selectedWindowPaneOption,
        handleSelectedWindowPaneChange,
        handleGetWindowPaneKey,
        handleGetWindowPaneTitle,
    };
}

function useVentType(ventType: VentType | null) {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;

    const ventTypeOptions = useMemo<VentTypeOption[]>(() => {
        const result: VentTypeOption[] =
            VENT_TYPE_VALUES.map((id) => ({
                id,
                title: ventTypeTitle(id),
            })) ?? [];
        return result;
    }, []);

    const selectedVentTypeOption = useMemo(
        () =>
            ventTypeOptions?.find((value) => value.id === ventType) ??
            ventTypeOptions[0],
        [ventType, ventTypeOptions]
    );

    const handleSelectedVentTypeChange = useCallback(
        async (_event: SyntheticEvent, newValue: VentTypeOption | null) => {
            const id = newValue?.id;
            await setField(
                'custom.economicImpacts.advancedParameters.wildfireLoss.ventType',
                id ?? undefined
            );
        },
        [setField]
    );

    const handleGetVentTypeKey = useCallback((option: VentTypeOption) => {
        return String(option.id);
    }, []);

    const handleGetVentTypeTitle = useCallback((option: VentTypeOption) => {
        return option.title;
    }, []);

    return {
        ventTypeOptions,
        selectedVentTypeOption,
        handleSelectedVentTypeChange,
        handleGetVentTypeKey,
        handleGetVentTypeTitle,
    };
}

function useRoofCover(roofCover: RoofCover | null) {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;

    const roofCoverOptions = useMemo<RoofCoverOption[]>(() => {
        const result: RoofCoverOption[] =
            ROOF_COVER_VALUES.map((id) => ({
                id,
                title: roofCoverTitle(id),
            })) ?? [];
        return result;
    }, []);

    const selectedRoofCoverOption = useMemo(
        () =>
            roofCoverOptions?.find((value) => value.id === roofCover) ??
            roofCoverOptions[0],
        [roofCover, roofCoverOptions]
    );

    const handleSelectedRoofCoverChange = useCallback(
        (_event: SyntheticEvent, newValue: RoofCoverOption | null) => {
            const id = newValue?.id;
            setField(
                'custom.economicImpacts.advancedParameters.wildfireLoss.roofCover',
                id ?? undefined
            );
        },
        [setField]
    );

    const handleGetRoofCoverKey = useCallback((option: RoofCoverOption) => {
        return String(option.id);
    }, []);

    const handleGetRoofCoverTitle = useCallback((option: RoofCoverOption) => {
        return option.title;
    }, []);

    return {
        roofCoverOptions,
        selectedRoofCoverOption,
        handleSelectedRoofCoverChange,
        handleGetRoofCoverKey,
        handleGetRoofCoverTitle,
    };
}
