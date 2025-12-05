import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import camelCase from 'lodash/camelCase';
import MenuItem from '@mui/material/MenuItem';
import { ComponentProps, useCallback } from 'react';

export type SelectOption = { label: string; value: string };

export type SelectProps = {
    id?: string;
    label?: string;
    value: string;
    options?: SelectOption[];
    onChange?: (value: string) => void;
    testId?: string;
    size?: ComponentProps<typeof MuiSelect>['size'];
    variant?: ComponentProps<typeof MuiSelect>['variant'];
};
export function Select({
    id,
    label,
    value,
    options,
    onChange,
    testId,
    size,
    variant,
}: SelectProps) {
    const inputId = id ?? (camelCase(label) || undefined);
    const labelId = `${inputId}-label`;

    const handleChange = useCallback(
        (e: SelectChangeEvent) => {
            onChange?.(e.target.value);
        },
        [onChange]
    );

    return (
        <FormControl fullWidth>
            {label && <InputLabel id={labelId}>{label}</InputLabel>}
            <MuiSelect
                labelId={labelId}
                id={inputId}
                value={value}
                label={label}
                onChange={handleChange}
                data-testid={testId}
                variant={variant}
                size={size}
            >
                {options?.map(({ label, value }) => (
                    <MenuItem
                        key={value}
                        value={value}
                    >
                        {label}
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormControl>
    );
}
