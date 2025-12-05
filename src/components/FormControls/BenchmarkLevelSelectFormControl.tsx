import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ComponentProps, FC, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { ScoresResultSetOptions } from '../../api/openapi/auto-generated';
import { useBenchmarkLevelOptions } from '../../hooks/useBenchmarkLevelOptions';
import { BenchmarkLevel } from '../../types';

interface BenchmarkLevelSelectFormControlProps
    extends ComponentProps<typeof FormControl> {
    resultSetOptions: ScoresResultSetOptions;
    initialValue?: BenchmarkLevel | '';
}

export const BenchmarkLevelSelectFormControl: FC<
    BenchmarkLevelSelectFormControlProps
> = ({ resultSetOptions, initialValue = '', ...props }) => {
    const form = useFormikContext<{ benchmarkLevel?: number | '' }>();
    const { setFieldValue } = form;
    const benchmarkLevelSelectOptions =
        useBenchmarkLevelOptions(resultSetOptions);

    useEffect(() => {
        setFieldValue(
            'benchmarkLevel',
            benchmarkLevelSelectOptions[0].id || initialValue
        );
    }, [benchmarkLevelSelectOptions, setFieldValue, initialValue]);

    return (
        <FormControl
            fullWidth
            size="small"
            {...props}
            data-testid="benchmark-field"
        >
            <InputLabel
                id="benchmark-level-label"
                shrink
                data-testid="benchmark-field-label"
            >
                Score type
            </InputLabel>
            <Select
                labelId="benchmark-level-label"
                id="benchmark-level-select"
                name="benchmarkLevel"
                value={form.values.benchmarkLevel}
                label="Score type"
                displayEmpty
                onChange={form.handleChange}
                error={
                    form.touched.benchmarkLevel &&
                    Boolean(form.errors.benchmarkLevel)
                }
                data-testid="benchmark-field-select"
            >
                {benchmarkLevelSelectOptions.map(({ id, title }) => (
                    <MenuItem
                        key={id}
                        value={id}
                        data-testid="benchmark-field-option"
                    >
                        {title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
