import { ComponentProps, FC, useEffect, useMemo } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useFormikContext } from 'formik';
import { ImpactType, LossType } from '../../types';
import { useLossTypeOptions } from '../../hooks/useLossTypeOptions';

interface LossTypeSelectFormControlProps
    extends ComponentProps<typeof FormControl> {
    initialValue?: LossType;
    impactType: ImpactType;
}

export const LossTypeSelectFormControl: FC<LossTypeSelectFormControlProps> = ({
    initialValue = LossType.Total,
    impactType,
    ...props
}) => {
    const form = useFormikContext<{ lossType?: LossType }>();
    const { setFieldValue } = form;
    const lossTypeOptions = useLossTypeOptions();

    useEffect(() => {
        if (!lossTypeOptions || lossTypeOptions.length === 0) {
            setFieldValue('lossType', initialValue);
            return;
        }

        setFieldValue('lossType', lossTypeOptions[0].id);
    }, [lossTypeOptions, setFieldValue, initialValue]);

    const label = useMemo(() => {
        return impactType === ImpactType.Damage ? 'Damage Type' : 'Loss Type';
    }, [impactType]);

    return (
        <FormControl
            fullWidth
            size="small"
            {...props}
            data-testid="damage-loss-type-select-form-control"
        >
            <InputLabel
                id="loss-type-label"
                data-testid="damage-loss-type-field-label"
            >
                {label}
            </InputLabel>
            <Select
                labelId="loss-type-label"
                id="loss-type-select"
                name="lossType"
                value={form.values.lossType}
                label={label}
                onChange={form.handleChange}
                error={form.touched.lossType && Boolean(form.errors.lossType)}
                data-testid="damage-loss-type-select"
            >
                {lossTypeOptions.map(({ id, title }) => (
                    <MenuItem
                        key={id}
                        value={id}
                        data-testid="damage-loss-type-option"
                    >
                        {title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
