import { ChangeEvent, ComponentProps, FC, useCallback } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { Section } from '../../../Section';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { IPortfolio } from '../../../../../../types/portfolio';

interface FloodDefenseSectionFormProps extends ComponentProps<typeof Box> {}

export const FloodDefenseSectionForm: FC<FloodDefenseSectionFormProps> = ({
    sx,
    ...props
}) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField, setFields } = formik;
    const { custom } = formik.values;

    const { enabled, zeroOutDefendedLocations } = custom.floodMesh.floodDefense;

    const handleEnabledChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setFields({
                'custom.floodMesh.floodDefense.enabled': event.target.checked,
                'custom.floodMesh.floodDefense.zeroOutDefendedLocations':
                    event.target.checked,
            });
        },
        [setFields]
    );

    const handleZeroOutDefendedLocationsChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            await setField(
                'custom.floodMesh.floodDefense.zeroOutDefendedLocations',
                event.target.checked
            );
        },
        [setField]
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
                            name="custom.floodMesh.floodDefense.zeroOutDefendedLocations"
                            checked={zeroOutDefendedLocations}
                            disabled={!enabled}
                            onChange={handleZeroOutDefendedLocationsChange}
                        />
                    }
                    label="Adjust depths for protected locations"
                />
            </Box>
        </Section>
    );
};
