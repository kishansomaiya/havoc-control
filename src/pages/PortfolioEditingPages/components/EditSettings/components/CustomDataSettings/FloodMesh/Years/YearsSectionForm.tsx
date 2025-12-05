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
import { IPortfolio } from '../../../../../../types/portfolio';
import { Section } from '../../../Section';
import { MESH_YEARS } from '../../../../../../../../const';

interface Option {
    year: number;
}

const options: Option[] = MESH_YEARS.map((year) => ({ year })) ?? [];

interface YearsSectionFormProps extends ComponentProps<typeof Box> {}

export const YearsSectionForm: FC<YearsSectionFormProps> = ({ ...props }) => {
    const formik = useFormikContextHelpers<IPortfolio>();
    const { setField } = formik;
    const { custom } = formik.values;

    const selectedYears = custom.floodMesh.years;

    const selectedOptions = useMemo<Option[]>(() => {
        return options.filter((option) => selectedYears.includes(option.year));
    }, [selectedYears]);

    const handleSelectedOptionsChange = useCallback(
        async (_event: SyntheticEvent, newSelectedOptions: Option[]) => {
            const years = newSelectedOptions.map((option) => option.year);
            await setField('custom.floodMesh.years', years);
        },
        [setField]
    );

    return (
        <Section
            {...props}
            title="Years"
        >
            <Autocomplete
                fullWidth
                multiple
                options={options}
                getOptionLabel={(option) => String(option.year)}
                value={selectedOptions}
                onChange={handleSelectedOptionsChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Select options"
                        placeholder="and more"
                        name="custom.floodMesh.years"
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.custom?.floodMesh?.years &&
                            Boolean(formik.errors.custom?.floodMesh?.years)
                        }
                        helperText={
                            formik.touched.custom?.floodMesh?.years &&
                            Boolean(formik.errors.custom?.floodMesh?.years)
                                ? formik.errors.custom?.floodMesh?.years
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
                                label={String(option.year)}
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
