import { ChangeEvent, ComponentProps, FC, useCallback } from 'react';
import TextField from '@mui/material/TextField';

interface FormStringTextFieldProps extends ComponentProps<typeof TextField> {
    setField: (field: string, value: unknown) => void;
}

// This component's primary purpose is to avoid accidentally passing
// undefined value to TextField which accepts it, but turns into
// uncontrolled component as a result.
// Also it can be used for consistency together with other Form* components.
export const FormStringTextField: FC<FormStringTextFieldProps> = ({
    setField,
    name,
    value,
    disabled,
    ...props
}) => {
    const handleChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            if (!name) {
                return;
            }
            const value = event.target.value;
            await setField(name, value);
        },
        [name, setField]
    );

    return (
        <TextField
            {...props}
            sx={{
                opacity: disabled ? 0.5 : undefined,
            }}
            name={name}
            value={value ?? ''}
            onChange={handleChange}
            disabled={disabled}
        />
    );
};
