import { ChangeEvent, ComponentProps, FC, useCallback } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { Section } from '../../../Section';
import { IPortfolio } from '../../../../../../types/portfolio';
import { PERIL_FLOOD_DEFENSE_DISABLED_OPTIONS } from '../../../../../../../../const';

interface FloodDefenseSectionFormProps extends ComponentProps<typeof Box> {}

export const FloodDefenseSectionForm: FC<FloodDefenseSectionFormProps> = ({
    sx,
    ...props
}) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { handleChange, setFields } = formik;
    const { dataVersion, custom } = formik.values;

    const { enabled, zeroOutDefendedLocations } =
        custom.perilMetrics.floodDefenseOptions;

    const disabled = PERIL_FLOOD_DEFENSE_DISABLED_OPTIONS[dataVersion];

    const handleEnabledChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setFields({
                'custom.perilMetrics.floodDefenseOptions.enabled':
                    event.target.checked,
                'custom.perilMetrics.floodDefenseOptions.zeroOutDefendedLocations':
                    event.target.checked,
            });
        },
        [setFields]
    );

    return (
        <Section
            {...props}
            sx={{ ...sx, gap: 1 }}
            title="Flood Defense"
        >
            <Box
                display="flex"
                flexDirection="column"
                gap={0}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            name="custom.perilMetrics.floodDefenseOptions.enabled"
                            checked={enabled}
                            onChange={handleEnabledChange}
                        />
                    }
                    label="Enable Flood Defenses"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            name="custom.perilMetrics.floodDefenseOptions.zeroOutDefendedLocations"
                            checked={zeroOutDefendedLocations}
                            onChange={handleChange}
                            disabled={
                                !enabled || disabled.zeroOutDefendedLocations
                            }
                        />
                    }
                    label="Adjust depths for protected locations"
                />
            </Box>
        </Section>
    );
};
