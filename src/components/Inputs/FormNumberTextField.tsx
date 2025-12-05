import {
    ChangeEvent,
    ComponentProps,
    FC,
    FocusEventHandler,
    useCallback,
    useEffect,
    useState,
} from 'react';
import TextField from '@mui/material/TextField';

interface FormNumberTextFieldProps extends ComponentProps<typeof TextField> {
    value?: number;
    setField: (field: string, value: unknown) => void;
}

export const FormNumberTextField: FC<FormNumberTextFieldProps> = ({
    setField,
    name,
    value,
    disabled,
    ...props
}) => {
    const [temporaryValue, setTemporaryValue] = useState(
        value !== undefined ? String(value) : ''
    );

    useEffect(() => {
        setTemporaryValue(value !== undefined ? String(value) : '');
    }, [value]);

    const updateDataSourceIfValid = useCallback(
        async (newValue: string) => {
            if (!name) {
                return false;
            }
            if (newValue.length === 0) {
                await setField(name, undefined);
                return true;
            } else {
                const number = Number(newValue);
                if (!Number.isNaN(number)) {
                    await setField(name, number);
                    return true;
                }
            }
            return false;
        },
        [name, setField]
    );

    const handleChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setTemporaryValue(value);
            await updateDataSourceIfValid(value);
        },
        [updateDataSourceIfValid]
    );

    const handleBlur: FocusEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = useCallback(
        async (event) => {
            const value = event.target.value;
            // Prettify text in TextField
            let number = value.length > 0 ? Number(value) : undefined;
            if (number !== undefined && Number.isNaN(number)) {
                number = 0;
            }
            setTemporaryValue(number !== undefined ? String(number) : '');
            // Try updating data source
            const updated = await updateDataSourceIfValid(value);
            // If failed, just reset it to prettified one
            if (name !== undefined && !updated) {
                await setField(name, number !== undefined ? number : undefined);
            }
        },
        [name, setField, updateDataSourceIfValid]
    );

    return (
        <TextField
            {...props}
            sx={{
                opacity: disabled ? 0.5 : undefined,
            }}
            value={temporaryValue}
            inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9.]*',
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
        />
    );
};
