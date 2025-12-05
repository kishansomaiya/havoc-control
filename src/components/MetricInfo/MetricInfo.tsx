import { Box, Tooltip, Typography } from '@mui/material';
import { ComponentProps, FC, useMemo } from 'react';
import * as Icon from 'react-feather';
import { isNumber, numberValueFormatter } from '../../utils';
import { useDifferenceColor } from '../../hooks/useDifferenceColor';
import { UnitOfMeasure } from '../../types';
import { UNIT_OF_MEASURE_FRACTION_DIGITS } from '../../const';

const getFormattedByUnitOfMeasureValue = (
    value: number | null | undefined,
    unitOfMeasure?: UnitOfMeasure
): string => {
    const fractionDigits =
        unitOfMeasure && UNIT_OF_MEASURE_FRACTION_DIGITS[unitOfMeasure];
    return isNumber(value)
        ? numberValueFormatter({ value, fractionDigits })
        : '-';
};

interface MetricInfoProps extends ComponentProps<typeof Box> {
    yearFrom: number;
    yearTo: number;
    tooltip: string;
    title: string;
    fromValue: number | null | undefined;
    toValue: number | null | undefined;
    currencyCode?: string;
    unitOfMeasure?: UnitOfMeasure;
    fractionDigits?: number;
}

export const MetricInfo: FC<MetricInfoProps> = ({
    yearFrom,
    yearTo,
    tooltip,
    title,
    fromValue,
    toValue,
    currencyCode,
    unitOfMeasure,
    fractionDigits,
    ...props
}) => {
    const differenceValue = useMemo<number | undefined>(() => {
        if (!fromValue && fromValue !== 0) {
            return;
        }
        if (!toValue && toValue !== 0) {
            return;
        }

        return Number(toValue) - Number(fromValue);
    }, [toValue, fromValue]);

    const prefixSign = useMemo<string>(() => {
        if (!differenceValue) {
            return '';
        }
        return differenceValue > 0 ? '+' : '';
    }, [differenceValue]);

    const differenceInPercents = useMemo(() => {
        if (
            !differenceValue ||
            !fromValue ||
            differenceValue === 0 ||
            fromValue === 0
        ) {
            return undefined;
        }

        return ((differenceValue * 100) / fromValue).toFixed();
    }, [differenceValue, fromValue]);

    const color = useDifferenceColor(differenceValue);

    const formattedFromValue = useMemo(() => {
        if (isNumber(fractionDigits) && isNumber(fromValue)) {
            return numberValueFormatter({ value: fromValue, fractionDigits });
        }
        return getFormattedByUnitOfMeasureValue(fromValue, unitOfMeasure);
    }, [fromValue, unitOfMeasure, fractionDigits]);

    const formattedToValue = useMemo(() => {
        if (isNumber(fractionDigits) && isNumber(toValue)) {
            return numberValueFormatter({ value: toValue, fractionDigits });
        }
        return getFormattedByUnitOfMeasureValue(toValue, unitOfMeasure);
    }, [toValue, unitOfMeasure, fractionDigits]);

    return (
        <Box {...props}>
            <Box
                display="flex"
                alignItems="start"
                color="text.secondary"
                gap={0.5}
                pb={1}
            >
                <Typography
                    variant="h6"
                    data-testid="metrics-title"
                >
                    <span>{title}</span>
                    {currencyCode && (
                        <>
                            <br />({currencyCode})
                        </>
                    )}
                </Typography>
                <Tooltip
                    title={tooltip}
                    arrow
                    placement="top"
                    data-testid="metrics-tooltip"
                >
                    <Icon.Info size="0.875rem" />
                </Tooltip>
            </Box>

            <Box
                display="flex"
                alignItems="center"
                gap={1}
                pb={0.5}
                data-testid="metrics-year-from"
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    data-testid="metrics-year-from-label"
                >
                    {yearFrom}
                </Typography>
                <Typography
                    variant="h2"
                    color="text.primary"
                    data-testid="metrics-year-from-value"
                >
                    {formattedFromValue}
                </Typography>
            </Box>
            <Box
                display="flex"
                alignItems="center"
                gap={1}
                data-testid="metrics-year-to"
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    data-testid="metrics-year-to-label"
                >
                    {yearTo}
                </Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                >
                    <Typography
                        variant="h2"
                        color={color}
                        data-testid="metrics-year-to-value"
                    >
                        {formattedToValue}
                    </Typography>
                    <Typography
                        variant="h4"
                        color={color}
                        data-testid="metrics-year-to-value-percent"
                    >
                        {differenceInPercents
                            ? `(${prefixSign}${differenceInPercents}%)`
                            : ''}{' '}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
