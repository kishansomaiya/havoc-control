import {
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useMemo,
} from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { FormIntegerTextField } from '../../../../../../../../components/Inputs/FormIntegerTextField';
import { FormNumberTextField } from '../../../../../../../../components/Inputs/FormNumberTextField';
import { Section } from '../../../Section';
import { GridFieldSet } from '../../../GridFieldSet';
import { GridField } from '../../../GridField';
import { ECONOMIC_IMPACT_DISABLED_OPTIONS } from '../../../../../../../../const';
import {
    OCCUPANCY_SCHEME_VALUES,
    OccupancyScheme,
    occupancySchemeTitle,
    BASEMENT_CODE_VALUES,
    BasementCode,
    basementCodeTitle,
    DataVersion,
} from '../../../../../../../../types';
import { IPortfolio } from '../../../../../../types/portfolio';

interface OccupancySchemeOption {
    id: OccupancyScheme;
    title: string;
}

interface BasementCodeOption {
    id: BasementCode;
    title: string;
}

interface DefaultBuildingAttributesSectionFormProps
    extends ComponentProps<typeof Box> {}

export const DefaultBuildingAttributesSectionForm: FC<
    DefaultBuildingAttributesSectionFormProps
> = ({ ...props }) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const {
        occupancyScheme,
        occupancyCode,
        numberOfStories,
        basementCode,
        firstFloorElevation,
        floorAreaSqm,
    } = custom.economicImpacts.defaultBuildingAttributes;

    const {
        occupancySchemeOptions,
        selectedOccupancySchemeOption,
        handleSelectedOccupancySchemeChange,
        handleGetOccupancySchemeKey,
        handleGetOccupancySchemeTitle,
    } = useOccupancyScheme(occupancyScheme);

    const {
        basementCodeOptions,
        selectedBasementCodeOption,
        handleSelectedBasementCodeChange,
        handleGetBasementCodeKey,
        handleGetBasementCodeTitle,
    } = useBasementCode(basementCode ?? null);

    const touched =
        formik.touched.custom?.economicImpacts?.defaultBuildingAttributes;
    const errors =
        formik.errors.custom?.economicImpacts?.defaultBuildingAttributes;
    const disabled = ECONOMIC_IMPACT_DISABLED_OPTIONS[dataVersion];

    const occupancyCodeError = errors?.occupancyCode;
    const isOccupancyCodeError =
        touched?.occupancyCode && occupancyCodeError !== undefined;

    const numberOfStoriesError = errors?.numberOfStories;
    const isNumberOfStoriesError =
        touched?.numberOfStories && numberOfStoriesError !== undefined;

    const firstFloorElevationError = errors?.firstFloorElevation;
    const isFirstFloorElevationError =
        touched?.firstFloorElevation && firstFloorElevationError !== undefined;

    const floorAreaSqmError = errors?.floorAreaSqm;
    const isFloorAreaSqmError =
        touched?.floorAreaSqm && floorAreaSqmError !== undefined;

    return (
        <Section
            {...props}
            title="Default Building Attributes"
        >
            <GridFieldSet>
                <GridField>
                    <Autocomplete
                        options={occupancySchemeOptions}
                        disableClearable
                        freeSolo={false}
                        value={selectedOccupancySchemeOption}
                        onChange={handleSelectedOccupancySchemeChange}
                        getOptionKey={handleGetOccupancySchemeKey}
                        getOptionLabel={handleGetOccupancySchemeTitle}
                        renderInput={({ inputProps, ...params }) => (
                            <TextField
                                {...params}
                                label="Occupancy Scheme"
                                placeholder="Enter Value"
                                variant="outlined"
                                inputProps={{
                                    ...inputProps,
                                    readOnly: true,
                                }}
                            />
                        )}
                        fullWidth
                    />
                </GridField>
                <GridField>
                    <FormIntegerTextField
                        name="custom.economicImpacts.defaultBuildingAttributes.occupancyCode"
                        label="Occupancy Code"
                        placeholder="Enter Value"
                        value={occupancyCode}
                        setField={setField}
                        fullWidth
                        error={isOccupancyCodeError}
                        helperText={
                            isOccupancyCodeError ? occupancyCodeError : ''
                        }
                    />
                </GridField>
                <GridField>
                    <FormIntegerTextField
                        name="custom.economicImpacts.defaultBuildingAttributes.numberOfStories"
                        label="Number of Stories"
                        placeholder="Enter Value"
                        value={numberOfStories}
                        setField={setField}
                        fullWidth
                        error={isNumberOfStoriesError}
                        helperText={
                            isNumberOfStoriesError ? numberOfStoriesError : ''
                        }
                    />
                </GridField>
                <GridField>
                    <Autocomplete
                        options={basementCodeOptions}
                        disableClearable
                        freeSolo={false}
                        value={selectedBasementCodeOption}
                        onChange={handleSelectedBasementCodeChange}
                        getOptionKey={handleGetBasementCodeKey}
                        getOptionLabel={handleGetBasementCodeTitle}
                        renderInput={({ inputProps, ...params }) => (
                            <TextField
                                {...params}
                                label="Basement Code"
                                placeholder="Enter Value"
                                variant="outlined"
                                inputProps={{
                                    ...inputProps,
                                    readOnly: true,
                                }}
                            />
                        )}
                        fullWidth
                    />
                </GridField>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.defaultBuildingAttributes.firstFloorElevation"
                        label="First Floor Elevation"
                        placeholder="Enter Value"
                        value={firstFloorElevation}
                        setField={setField}
                        fullWidth
                        error={isFirstFloorElevationError}
                        helperText={
                            isFirstFloorElevationError
                                ? firstFloorElevationError
                                : 'Meters'
                        }
                        disabled={disabled.firstFloorElevation}
                    />
                </GridField>
                <GridField>
                    <FormNumberTextField
                        name="custom.economicImpacts.defaultBuildingAttributes.floorAreaSqm"
                        label="Floor Area"
                        placeholder="Enter Value"
                        value={floorAreaSqm}
                        setField={setField}
                        fullWidth
                        error={isFloorAreaSqmError}
                        helperText={
                            isFloorAreaSqmError
                                ? floorAreaSqmError
                                : 'Square Meters'
                        }
                        disabled={disabled.floorAreaSqm}
                    />
                </GridField>
            </GridFieldSet>
        </Section>
    );
};

function useOccupancyScheme(occupancyScheme: OccupancyScheme) {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion } = formik.values;

    const occupancySchemeOptions = useMemo<OccupancySchemeOption[]>(() => {
        const OccupancySchemes =
            dataVersion === DataVersion.v2_6_2
                ? OCCUPANCY_SCHEME_VALUES.filter((scheme) => scheme !== 'OED')
                : OCCUPANCY_SCHEME_VALUES;
        const result: OccupancySchemeOption[] =
            OccupancySchemes.map((id) => ({
                id,
                title: occupancySchemeTitle(id),
            })) ?? [];
        return result;
    }, [dataVersion]);

    const selectedOccupancySchemeOption = useMemo(
        () =>
            occupancySchemeOptions?.find(
                (value) => value.id === occupancyScheme
            ) ?? occupancySchemeOptions[0],
        [occupancyScheme, occupancySchemeOptions]
    );

    const handleSelectedOccupancySchemeChange = useCallback(
        async (
            _event: SyntheticEvent,
            newValue: OccupancySchemeOption | null
        ) => {
            const id = newValue?.id;
            if (id) {
                await setField(
                    'custom.economicImpacts.defaultBuildingAttributes.occupancyScheme',
                    id
                );
            }
        },
        [setField]
    );

    const handleGetOccupancySchemeKey = useCallback(
        (option: OccupancySchemeOption) => {
            return option.id;
        },
        []
    );

    const handleGetOccupancySchemeTitle = useCallback(
        (option: OccupancySchemeOption) => {
            return option.title;
        },
        []
    );

    return {
        occupancySchemeOptions,
        selectedOccupancySchemeOption,
        handleSelectedOccupancySchemeChange,
        handleGetOccupancySchemeKey,
        handleGetOccupancySchemeTitle,
    };
}

function useBasementCode(basementCode: BasementCode | null) {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;

    const basementCodeOptions = useMemo<BasementCodeOption[]>(() => {
        const result: BasementCodeOption[] =
            BASEMENT_CODE_VALUES.map((id) => ({
                id,
                title: basementCodeTitle(id),
            })) ?? [];
        return result;
    }, []);

    const selectedBasementCodeOption = useMemo(
        () =>
            basementCodeOptions?.find((value) => value.id === basementCode) ??
            basementCodeOptions[0],
        [basementCode, basementCodeOptions]
    );

    const handleSelectedBasementCodeChange = useCallback(
        async (_event: SyntheticEvent, newValue: BasementCodeOption | null) => {
            const id = newValue?.id;
            await setField(
                'custom.economicImpacts.defaultBuildingAttributes.basementCode',
                id ?? undefined
            );
        },
        [setField]
    );

    const handleGetBasementCodeKey = useCallback(
        (option: BasementCodeOption) => {
            return option.id;
        },
        []
    );

    const handleGetBasementCodeTitle = useCallback(
        (option: BasementCodeOption) => {
            return option.title;
        },
        []
    );

    return {
        basementCodeOptions,
        selectedBasementCodeOption,
        handleSelectedBasementCodeChange,
        handleGetBasementCodeKey,
        handleGetBasementCodeTitle,
    };
}
