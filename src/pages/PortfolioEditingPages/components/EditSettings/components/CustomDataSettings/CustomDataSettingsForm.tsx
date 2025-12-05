import { ComponentProps, FC } from 'react';
import { Box, FormGroup } from '@mui/material';
import { PerilMetricsOptionsForm } from './PerilMetrics/PerilMetricsOptionsForm';
import { EconomicImpactsOptionsForm } from './EconomicImpacts/EconomicImpactsOptionsForm';
import { ScoresOptionsForm } from './Scores/ScoresOptionsForm';
import { FloodMeshOptionsForm } from './FloodMesh/FloodMeshOptionsForm';

interface CustomDataSettingsFormProps extends ComponentProps<typeof Box> {}

export const CustomDataSettingsForm: FC<CustomDataSettingsFormProps> = ({
    ...props
}) => {
    return (
        <Box
            display="flex"
            alignSelf="stretch"
            flexDirection="column"
            {...props}
            data-testid="custom-data-settings-form"
        >
            <FormGroup>
                <PerilMetricsOptionsForm 
                    defaultExpanded
                    data-testid="custom-data-settings-form-peril"
                />
                <EconomicImpactsOptionsForm 
                    data-testid="custom-data-settings-form-economic-impacts"
                />
                <ScoresOptionsForm 
                    data-testid="custom-data-settings-form-scores"
                />
                <FloodMeshOptionsForm 
                    data-testid="custom-data-settings-form-flood-mesh"
                />
            </FormGroup>
        </Box>
    );
};
