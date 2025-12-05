import { ComponentProps, FC, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useFormikContext } from 'formik';
import { ResultSetDataSchema } from '../../api/openapi/auto-generated';
import { useMetricSelectOptions } from '../../hooks/useHazardFilterOptions';
import { Score } from '../../types';
import { DEFAULT_METRIC_VALUES } from '../../const/defaultMetricValues';

interface MetricSelectFormControlProps
    extends ComponentProps<typeof FormControl> {
    resultSetSchema: Array<ResultSetDataSchema>;
    score: Score;
    initialValue?: string;
}

export const MetricSelectFormControl: FC<MetricSelectFormControlProps> = ({
    resultSetSchema,
    score,
    initialValue = '',
    ...props
}) => {
    const form = useFormikContext<{ metric?: string }>();
    const { setFieldValue } = form;

    const metricSelectOptions = useMetricSelectOptions({
        resultSetSchema,
        score,
    });

    const isSingleOrNoOption = (metricSelectOptions?.length || 0) <= 1;

    useEffect(() => {
        if (!metricSelectOptions || metricSelectOptions.length === 0) {
            setFieldValue('metric', initialValue);
            return;
        }

        let defaultMetricOption = metricSelectOptions.find(({ id }) =>
            DEFAULT_METRIC_VALUES.includes(id)
        );

        defaultMetricOption = defaultMetricOption || metricSelectOptions[0];

        setFieldValue('metric', defaultMetricOption.id);
    }, [metricSelectOptions, setFieldValue, initialValue]);

    return (
        <FormControl
            fullWidth
            size="small"
            disabled={isSingleOrNoOption}
            {...props}
            data-testid="metric-select-field"
        >
            <InputLabel
                id="metric-label"
                data-testid="metric-field-label"
            >
                Metric
            </InputLabel>
            <Select
                labelId="metric-label"
                id="metric-select"
                name="metric"
                value={form.values.metric}
                label="Metric"
                onChange={form.handleChange}
                error={form.touched.metric && Boolean(form.errors.metric)}
                disabled={isSingleOrNoOption}
                data-testid="metric-field-select"
            >
                {metricSelectOptions.map((option) => (
                    <MenuItem
                        key={option.id}
                        value={option.id}
                        data-testid="metric-field-option"
                    >
                        {option.enhancedName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
