import { Typography } from '@mui/material';
import { ComponentProps, FC, useMemo } from 'react';
import { useDifferenceColor } from '../../hooks/useDifferenceColor';
import { convertToPercentage, numberValueFormatter } from '../../utils';
import { UnitOfMeasure } from '../../types';
import { UNIT_OF_MEASURE_FRACTION_DIGITS } from '../../const';

interface ChangeIndicatorProps extends ComponentProps<typeof Typography> {
    previousValue?: number | null;
    currentValue?: number | null;
    unitOfMeasure?: UnitOfMeasure;
}

const NA_DIFFERENCE_VALUE = '-';

export const ChangeIndicator: FC<ChangeIndicatorProps> = ({
    variant = 'body2',
    previousValue,
    currentValue,
    unitOfMeasure,
    ...props
}) => {
    const differenceValue = useMemo<number | undefined>(() => {
        if (!previousValue && previousValue !== 0) {
            return;
        }
        if (!currentValue && currentValue !== 0) {
            return;
        }

        return Number(currentValue) - Number(previousValue);
    }, [previousValue, currentValue]);

    const prefixSign = useMemo<string>(() => {
        if (!differenceValue) {
            return '';
        }
        return differenceValue > 0 ? '+' : '';
    }, [differenceValue]);

    const difference = useMemo(() => {
        if (!differenceValue && differenceValue !== 0) {
            return NA_DIFFERENCE_VALUE;
        }

        let suffix = '';
        let formattedValue = numberValueFormatter({ value: differenceValue });
        if (unitOfMeasure === UnitOfMeasure.Percentage) {
            const value = convertToPercentage(differenceValue);
            if (!value) {
                return NA_DIFFERENCE_VALUE;
            }

            formattedValue = numberValueFormatter({
                value,
                fractionDigits: UNIT_OF_MEASURE_FRACTION_DIGITS[unitOfMeasure],
            });
            suffix = '%';
        }

        return `${prefixSign}${formattedValue}${suffix}`;
    }, [prefixSign, differenceValue, unitOfMeasure]);

    const color = useDifferenceColor(differenceValue);

    return (
        <Typography
            variant={variant}
            color={color}
            {...props}
            data-testid="table-change-indicator"
        >
            {difference}
        </Typography>
    );
};
