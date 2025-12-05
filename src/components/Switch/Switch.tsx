import MuiSwitch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChangeEvent, ComponentProps, useCallback } from 'react';
import camelCase from 'lodash/camelCase';

export type SwitchProps = {
    id?: string;
    checked?: boolean;
    onCheckedChange?: (value: boolean) => void;
    label?: string;
    labelVariant?: ComponentProps<typeof Typography>['variant'];
    disabled?: boolean;
    testId?: string;
};

export function Switch({
    label,
    labelVariant = 'body1',
    id,
    checked,
    onCheckedChange,
    disabled,
    testId,
}: SwitchProps) {
    const inputId = id ?? camelCase(label);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onCheckedChange?.(e.target.checked);
        },
        [onCheckedChange]
    );

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            {label && (
                <label htmlFor={inputId}>
                    <Typography variant={labelVariant}>{label}</Typography>
                </label>
            )}
            <MuiSwitch
                disabled={disabled}
                id={inputId}
                checked={checked}
                onChange={handleChange}
                data-testid={testId}
            />
        </Box>
    );
}
