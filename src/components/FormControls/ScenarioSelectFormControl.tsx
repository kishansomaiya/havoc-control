import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { SCENARIO_TITLES } from '../../const';
import { ComponentProps, FC, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Scenario } from '../../types';
import { PerilsOptionsOutput } from '../../api/openapi/auto-generated';
import {
    getDefaultScenarioOptionValue,
    useScenarioSelectOptions,
} from '../../hooks/useHazardFilterOptions';

interface ScenarioSelectFormControlProps
    extends ComponentProps<typeof FormControl> {
    resultSetOptions: PerilsOptionsOutput;
    initialValue?: Scenario | '';
}

export const ScenarioSelectFormControl: FC<ScenarioSelectFormControlProps> = ({
    resultSetOptions,
    initialValue = '',
    ...props
}) => {
    const form = useFormikContext<{ scenario?: Scenario | '' }>();
    const { setFieldValue } = form;
    const scenarioSelectOptions = useScenarioSelectOptions({
        resultSetOptions,
    });

    useEffect(() => {
        setFieldValue(
            'scenario',
            getDefaultScenarioOptionValue(scenarioSelectOptions) || initialValue
        );
    }, [scenarioSelectOptions, setFieldValue, initialValue]);
    return (
        <FormControl
            fullWidth
            size="small"
            {...props}
            data-testid="scenario-select-form-control"
        >
            <InputLabel
                data-testid="scenario-field-label"
                id="scenario-label"
            >
                Scenario
            </InputLabel>
            <Select
                labelId="scenario-label"
                id="scenario-select"
                name="scenario"
                value={form.values.scenario}
                renderValue={(value) => SCENARIO_TITLES[value]}
                label="Scenario"
                onChange={form.handleChange}
                error={form.touched.scenario && Boolean(form.errors.scenario)}
                data-testid="scenario-field-select"
            >
                {scenarioSelectOptions.map(({ title, id, description }) => (
                    <MenuItem
                        key={id}
                        value={id}
                        data-testid="scenario-option"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                        >
                            <Typography
                                variant="body1"
                                data-testid="scenario-option-title"
                            >
                                {title}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    maxWidth: '15rem',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'break-spaces',
                                }}
                                data-testid="scenario-option-description"
                            >
                                {description}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
