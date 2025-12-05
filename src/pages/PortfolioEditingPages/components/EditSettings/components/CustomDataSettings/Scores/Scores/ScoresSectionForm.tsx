import {
    ComponentProps,
    FC,
    SyntheticEvent,
    useCallback,
    useMemo,
} from 'react';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import * as Icon from 'react-feather';
import { useFormikContextHelpers } from '../../../../../../../../hooks/useFormikContextHelpers';
import { Section } from '../../../Section';
import { BenchmarkingSubSection } from './BenchmarkingSubSection';
import { Score } from '../../../../../../../../types';
import { IPortfolio } from '../../../../../../types/portfolio';
import {
    DEFAULT_SCORE_RESULT_SET_OPTIONS,
    SCORE_TITLES,
} from '../../../../../../../../const';

interface Option {
    id: Score;
    title: string;
}

interface ScoresSectionFormProps extends ComponentProps<typeof Box> {}

export const ScoresSectionForm: FC<ScoresSectionFormProps> = ({ ...props }) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { dataVersion, custom } = formik.values;

    const selectedIds = custom.scores.perils;

    const scoreData = DEFAULT_SCORE_RESULT_SET_OPTIONS[dataVersion];
    const options = useMemo<Option[]>(() => {
        const result: Option[] =
            scoreData?.perils?.map((id) => ({
                id: id as Score,
                title: SCORE_TITLES[id] ?? '',
            })) ?? [];
        return result;
    }, [scoreData]);

    const selectedOptions = useMemo<Option[]>(() => {
        return options.filter((option) => selectedIds.includes(option.id));
    }, [options, selectedIds]);

    const handleSelectedOptionsChange = useCallback(
        async (_event: SyntheticEvent, newSelectedOptions: Option[]) => {
            const ids = newSelectedOptions.map((option) => option.id);
            await setField('custom.scores.perils', ids);
        },
        [setField]
    );

    return (
        <Section
            {...props}
            title="Scores"
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
                        name="custom.scores.perils"
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.custom?.scores?.perils &&
                            Boolean(formik.errors.custom?.scores?.perils)
                        }
                        helperText={
                            formik.touched.custom?.scores?.perils &&
                            Boolean(formik.errors.custom?.scores?.perils)
                                ? formik.errors.custom?.scores?.perils
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
            <BenchmarkingSubSection />
        </Section>
    );
};
