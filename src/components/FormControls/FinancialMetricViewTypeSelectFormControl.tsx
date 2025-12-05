import { ComponentProps, FC, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useFormikContext } from 'formik';
import { FinancialMetricViewType } from '../../types';
import { useFinancialMetricViewTypeOptions } from '../../hooks/useFinancialMetricViewTypeOptions';

interface FinancialMetricViewTypeSelectFormControlProps
    extends ComponentProps<typeof FormControl> {
    initialValue?: FinancialMetricViewType;
}

export const FinancialMetricViewTypeSelectFormControl: FC<
    FinancialMetricViewTypeSelectFormControlProps
> = ({
    initialValue = FinancialMetricViewType.TransmissionChannel,
    ...props
}) => {
    const form = useFormikContext<{ viewType?: FinancialMetricViewType }>();
    const { setFieldValue } = form;
    const viewTypeOptions = useFinancialMetricViewTypeOptions();

    useEffect(() => {
        if (!viewTypeOptions || viewTypeOptions.length === 0) {
            setFieldValue('viewType', initialValue);
            return;
        }

        setFieldValue('viewType', viewTypeOptions[0].id);
    }, [viewTypeOptions, setFieldValue, initialValue]);

    return (
        <FormControl
            fullWidth
            size="small"
            {...props}
            data-testid="view-by-field-form-control"
        >
            <InputLabel
                id="view-type-label"
                data-testid="view-by-field-label"
            >
                View by
            </InputLabel>
            <Select
                labelId="view-type-label"
                id="view-type-select"
                name="viewType"
                value={form.values.viewType}
                label="View by"
                onChange={form.handleChange}
                error={form.touched.viewType && Boolean(form.errors.viewType)}
                data-testid="view-by-field-select"
            >
                {viewTypeOptions.map(({ id, title }) => (
                    <MenuItem
                        key={id}
                        value={id}
                        data-testid="view-by-field-option"
                    >
                        {title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
