import {
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import * as Icon from 'react-feather';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { Section } from '../../../Section';
import {
    ALL_PERILS,
    DISABLED_PERILS,
    PERIL_TITLES,
} from '../../../../../../../../const';
import { IPortfolio } from '../../../../../../types/portfolio';
import { Peril } from '../../../../../../../../types';
import { DataVersion } from '../../../../../../../../types';
import { useFeatureFlags } from '../../../../../../../../featureFlags/useFeatureFlags';

interface Option {
    id: Peril;
    title: string;
    isDisabled: boolean;
}

interface PerilsSectionFormProps extends ComponentProps<typeof Box> {}

export const PerilsSectionForm: FC<PerilsSectionFormProps> = ({ ...props }) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;
    const { data330Enabled } = useFeatureFlags('data330Enabled');
    const userEditedRef = useRef(false);

    const selectedIds = custom.perilMetrics.perils;

    const options = useMemo<Option[]>(() => {
        const result: Option[] =
            ALL_PERILS.map((id) => ({
                id: id as Peril,
                title: PERIL_TITLES[id] ?? '',
                isDisabled: DISABLED_PERILS[dataVersion].includes(id as Peril),
            })) ?? [];
        return result;
    }, [dataVersion]);

    const selectedOptions = useMemo<Option[]>(() => {
        return options.filter((option) => selectedIds.includes(option.id));
    }, [options, selectedIds]);

    const handleSelectedOptionsChange = useCallback(
        async (_event: SyntheticEvent, newSelectedOptions: Option[]) => {
            const ids = newSelectedOptions.map((option) => option.id);
            await setField('custom.perilMetrics.perils', ids);
            // Mark that user has manually edited selections to avoid auto re-adding defaults
            userEditedRef.current = true;
        },
        [setField]
    );

    useEffect(() => {
        if (
            data330Enabled &&
            dataVersion === DataVersion.v3_3_0 &&
            !custom.perilMetrics.perils.includes(Peril.Subsidence) &&
            !userEditedRef.current
        ) {
            setField('custom.perilMetrics.perils', [
                ...custom.perilMetrics.perils,
                Peril.Subsidence,
            ]);
        }
    }, [data330Enabled, dataVersion, custom.perilMetrics.perils, setField]);

    // If data version changes to one where Subsidence is disabled, ensure it is removed
    useEffect(() => {
        if (
            dataVersion !== DataVersion.v3_3_0 &&
            custom.perilMetrics.perils.includes(Peril.Subsidence)
        ) {
            setField(
                'custom.perilMetrics.perils',
                custom.perilMetrics.perils.filter((p) => p !== Peril.Subsidence)
            );
        }
    }, [dataVersion, custom.perilMetrics.perils, setField]);

    const checkCombinedFloodInPerils = useMemo(() => {
        const hasCombinedFloodInPerils =
            custom.perilMetrics.perils.includes(Peril.CombinedFlood) ?? false;

        return hasCombinedFloodInPerils;
    }, [custom.perilMetrics.perils]);

    const checkWindInPerils = useMemo(() => {
        const hasWindInPerils =
            custom.perilMetrics.perils.includes(Peril.Wind) ?? false;

        return hasWindInPerils;
    }, [custom.perilMetrics.perils]);

    useEffect(() => {
        setField(
            'custom.economicImpacts.advancedParameters.includeAcuteCombinedFlood',
            checkCombinedFloodInPerils
        );
    }, [checkCombinedFloodInPerils, setField]);

    useEffect(() => {
        setField(
            'custom.economicImpacts.advancedParameters.includeAcuteWind',
            checkWindInPerils
        );
    }, [checkWindInPerils, setField]);

    return (
        <Section
            {...props}
            title="Perils"
        >
            <Autocomplete
                fullWidth
                multiple
                options={options}
                getOptionLabel={(option) => option.title}
                getOptionDisabled={(option) => option.isDisabled}
                value={selectedOptions}
                onChange={handleSelectedOptionsChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Select options"
                        placeholder="and more"
                        name="custom.perilMetrics.perils"
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.custom?.perilMetrics?.perils &&
                            Boolean(formik.errors.custom?.perilMetrics?.perils)
                        }
                        helperText={
                            formik.touched.custom?.perilMetrics?.perils &&
                            Boolean(formik.errors.custom?.perilMetrics?.perils)
                                ? formik.errors.custom?.perilMetrics?.perils
                                : 'If you wish to include Economic Impacts in your analysis, you must include Wind, Combined Flood, Heat, Drought, and/or Wildfire in your list of Peril metrics. To enable Financial Metrics for Heat, Drought or Wildfire perils, you will also need to check either "Include Cost of Cooling", “Include Worker Productivity", "Include Cost of Water", and/or “Include Wildfire Loss” under Economic Impacts (below)'
                        }
                    />
                )}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                        const { key, ...props } = getTagProps({ index });
                        return (
                            <Chip
                                key={key}
                                {...props}
                                label={option.title}
                                deleteIcon={
                                    <Icon.X
                                        color="white"
                                        size="1rem"
                                        strokeWidth={1}
                                    />
                                }
                            />
                        );
                    })
                }
            />
        </Section>
    );
};
