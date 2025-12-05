import {
    ChangeEvent,
    ComponentProps,
    FC,
    InputHTMLAttributes,
    useCallback,
    useMemo,
} from 'react';
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    useTheme,
} from '@mui/material';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { Section } from '../../../Section';
import { IPortfolio } from '../../../../../../types/portfolio';
import {
    DEFAULT_PERIL_RESULT_SET_OPTIONS,
    SCENARIO_TITLES,
} from '../../../../../../../../const';
import { PerilsResultSetOptionsScenariosEnum } from '../../../../../../../../api/openapi/auto-generated';

interface Option {
    id: PerilsResultSetOptionsScenariosEnum;
    title: string;
}

interface ScenariosSectionFormProps extends ComponentProps<typeof Box> {}

export const ScenariosSectionForm: FC<ScenariosSectionFormProps> = ({
    sx,
    ...props
}) => {
    const theme = useTheme();
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const selectedIds = custom.perilMetrics.scenarios;

    const perilData = DEFAULT_PERIL_RESULT_SET_OPTIONS[dataVersion];
    const options = useMemo<Option[]>(() => {
        const result: Option[] =
            perilData?.scenarios?.map((id) => ({
                id,
                title: SCENARIO_TITLES[id] ?? '',
            })) ?? [];
        return result;
    }, [perilData]);

    const errors = formik.errors.custom?.perilMetrics;

    const handleOptionChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            const ids = new Set(selectedIds);
            const id = event.currentTarget.getAttribute(
                'data-id'
            ) as PerilsResultSetOptionsScenariosEnum;
            if (checked) {
                ids.add(id);
            } else {
                ids.delete(id);
            }
            await setField('custom.perilMetrics.scenarios', [...ids]);
        },
        [selectedIds, setField]
    );

    const isSelectAllChecked = selectedIds.length > 0;
    const isIndeterminate =
        isSelectAllChecked && selectedIds.length != options.length;

    const handleSelectAllChange = useCallback(
        async (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (checked) {
                const ids = options.map((option) => option.id);
                await setField('custom.perilMetrics.scenarios', ids);
            } else {
                await setField('custom.perilMetrics.scenarios', []);
            }
        },
        [options, setField]
    );

    const scenarios = useMemo(
        () =>
            options.map((option) => {
                return (
                    <FormControlLabel
                        key={option.id}
                        control={
                            <Checkbox
                                color="secondary"
                                data-id={option.id}
                                checked={selectedIds.includes(option.id)}
                                onChange={handleOptionChange}
                                inputProps={
                                    {
                                        'data-id': option.id,
                                    } as InputHTMLAttributes<HTMLInputElement>
                                }
                            />
                        }
                        label={option.title}
                    />
                );
            }),
        [handleOptionChange, options, selectedIds]
    );

    return (
        <Section
            {...props}
            sx={{ ...sx, gap: 1 }}
            title="Scenarios"
        >
            <Box
                display="flex"
                flexDirection="column"
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            checked={isSelectAllChecked}
                            indeterminate={isIndeterminate}
                            onChange={handleSelectAllChange}
                        />
                    }
                    label="Select All"
                />
                {scenarios}
            </Box>
            {errors?.scenarios !== undefined && (
                <FormHelperText
                    sx={{
                        color: theme.palette.error.light,
                    }}
                >
                    {errors?.scenarios}
                </FormHelperText>
            )}
        </Section>
    );
};
