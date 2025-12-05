import {
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useMemo,
} from 'react';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import * as Icon from 'react-feather';
import { Section } from '../../../Section';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { IPortfolio } from '../../../../../../types/portfolio';
import {
    DEFAULT_PERIL_RESULT_SET_OPTIONS,
    SCENARIO_TITLES,
} from '../../../../../../../../const';
import { Scenario } from '../../../../../../../../types';

interface Option {
    scenario: Scenario;
    title: string;
}

interface ScenariosSectionFormProps extends ComponentProps<typeof Box> {}

export const ScenariosSectionForm: FC<ScenariosSectionFormProps> = ({
    ...props
}) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const selectedScenarios = custom.floodMesh.scenarios;

    const perilData = DEFAULT_PERIL_RESULT_SET_OPTIONS[dataVersion];
    const options = useMemo<Option[]>(() => {
        const result: Option[] =
            perilData?.scenarios?.map((scenario) => ({
                scenario: scenario as Scenario,
                title: SCENARIO_TITLES[scenario] ?? '',
            })) ?? [];
        return result;
    }, [perilData]);

    const selectedOptions = useMemo<Option[]>(() => {
        return options.filter((option) =>
            selectedScenarios.includes(option.scenario)
        );
    }, [options, selectedScenarios]);

    const handleSelectedOptionsChange = useCallback(
        async (_event: SyntheticEvent, newSelectedOptions: Option[]) => {
            const scenarios = newSelectedOptions.map(
                (option) => option.scenario
            );
            await setField('custom.floodMesh.scenarios', scenarios);
        },
        [setField]
    );

    return (
        <Section
            {...props}
            title="Scenarios"
        >
            <Autocomplete
                fullWidth
                multiple
                options={options}
                getOptionLabel={(option) => option.title}
                value={selectedOptions}
                onChange={handleSelectedOptionsChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Select options"
                        placeholder="and more"
                        name="custom.floodMesh.scenarios"
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.custom?.floodMesh?.scenarios &&
                            Boolean(formik.errors.custom?.floodMesh?.scenarios)
                        }
                        helperText={
                            formik.touched.custom?.floodMesh?.scenarios &&
                            Boolean(formik.errors.custom?.floodMesh?.scenarios)
                                ? formik.errors.custom?.floodMesh?.scenarios
                                : ''
                        }
                    />
                )}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                        const { key, ...props } = getTagProps({ index });
                        return (
                            <Chip
                                key={key}
                                label={option.title}
                                {...props}
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
