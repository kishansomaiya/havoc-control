import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ComponentProps, FC, useEffect } from 'react';
import { useFormikContext } from 'formik';
import {
    getDefaultYearOptionValue,
    useYearSelectOptions,
} from '../../hooks/useHazardFilterOptions';
import { PerilsOptionsOutput } from '../../api/openapi/auto-generated';

interface YearSelectFormControlProps
    extends ComponentProps<typeof FormControl> {
    resultSetOptions: PerilsOptionsOutput;
    initialValue?: number | '';
}

export const YearSelectFormControl: FC<YearSelectFormControlProps> = ({
    resultSetOptions,
    initialValue = '',
    ...props
}) => {
    const form = useFormikContext<{ yearTo?: number | '' }>();
    const { setFieldValue } = form;
    const yearSelectOptions = useYearSelectOptions({ resultSetOptions });

    useEffect(() => {
        setFieldValue(
            'yearTo',
            getDefaultYearOptionValue(yearSelectOptions) || initialValue
        );
    }, [yearSelectOptions, setFieldValue, initialValue]);

    return (
        <FormControl
            fullWidth
            size="small"
            {...props}
            data-testid="year-select-field"
        >
            <InputLabel
                id="year-to-label"
                data-testid="year-field-label"
            >
                Year
            </InputLabel>
            <Select
                labelId="year-to-label"
                id="year-to-select"
                name="yearTo"
                value={form.values.yearTo}
                label="Year"
                onChange={form.handleChange}
                error={form.touched.yearTo && Boolean(form.errors.yearTo)}
                data-testid="year-field-select"
            >
                {yearSelectOptions.map((year) => (
                    <MenuItem
                        key={year}
                        value={year}
                        data-testid="year-field-option"
                    >
                        {year}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
