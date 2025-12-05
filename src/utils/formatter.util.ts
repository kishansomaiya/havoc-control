import { instanceOfCurrencyCode } from '../api/openapi/auto-generated';
import { DEFAULT_CURRENCY_CODE } from '../const';

const currencyWithoutGroupingFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
});

export const numberFormatter = (
    value: number,
    prefix: string = '',
    suffix: string = '',
    isShort: boolean = false
): string => {
    const prefixPart = prefix ? prefix : '';
    const valuePart = Intl.NumberFormat('en', {
        notation: isShort ? 'compact' : 'standard',
        maximumFractionDigits: 1,
    }).format(value);
    const suffixPart = suffix ? suffix : '';
    return `${prefixPart}${valuePart}${suffixPart}`;
};

export function roundedCurrencyString(value: number): string {
    return currencyWithoutGroupingFormatter.format(value);
}

export function roundedCurrency(value: number): number {
    return Number(roundedCurrencyString(value));
}

export const fileSizeFormatter = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const fileSize = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
    return `${fileSize} ${sizes[i]}`;
};

const formatNumberWithFractionDigits = (
    value: number,
    specifiedFractionDigits?: number
): string => {
    const [integerPart, fractionPart] = value.toString().split('.');
    const maxFractionDigits = 8 - integerPart.length;
    if (fractionPart.length <= maxFractionDigits) {
        return value.toFixed(specifiedFractionDigits ?? fractionPart.length);
    }

    const firstNonZeroFractionDigit = Array.from(
        fractionPart,
        Number
    ).findIndex((digit) => digit !== 0);

    let fractionDigits = Math.max(
        maxFractionDigits,
        firstNonZeroFractionDigit + 2
    );
    fractionDigits = Math.min(fractionDigits, maxFractionDigits);
    return Number(
        value.toFixed(specifiedFractionDigits ?? fractionDigits)
    ).toString();
};

export const numberValueFormatter = ({
    value,
    withDecimal = true,
    fractionDigits,
}: {
    value: number;
    withDecimal?: boolean;
    fractionDigits?: number;
}): string => {
    const [, fractionPart] = value.toString().split('.');

    if (!fractionPart || value >= 1_000) {
        return Intl.NumberFormat('en', {
            notation: 'compact',
            minimumFractionDigits: withDecimal && fractionDigits !== 0 ? 1 : 0,
            maximumFractionDigits: 1,
        }).format(value);
    }
    return formatNumberWithFractionDigits(value, fractionDigits);
};

export const tooltipValueFormatter = (
    value: number,
    fractionDigits?: number
) => {
    const [, fractionPart] = value.toString().split('.');

    if (!fractionPart || value >= 1_000) {
        return numberFormatter(value);
    }
    return formatNumberWithFractionDigits(value, fractionDigits);
};

export const formatUnit = (
    value: number,
    name: string,
    ending: string = 's'
) => {
    return `${value} ${name}${value !== 1 ? ending : ''}`;
};

export const currencyValueFormatter = ({
    value,
    currencyCode,
    decimalPlaces,
}: {
    value: number;
    currencyCode?: string;
    decimalPlaces?: number;
}): string => {
    const style = 'currency';
    const currency =
        currencyCode && instanceOfCurrencyCode(currencyCode)
            ? currencyCode
            : DEFAULT_CURRENCY_CODE;

    try {
        return Intl.NumberFormat('en-US', {
            style,
            currency,
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
        }).format(value);
    } catch (error) {
        return Intl.NumberFormat('en-US', {
            style,
            currency: DEFAULT_CURRENCY_CODE,
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
        }).format(value);
    }
};

export const abbreviateNumber = (value: number, decimalPlaces = 2) => {
    return Intl.NumberFormat('en-US', {
        notation: 'compact',
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(value);
};

export function floatToRatio(decimal: number): string {
    if (decimal === 0) {
        return '0:1';
    }

    // Find the greatest common divisor
    function gcd(a: number, b: number): number {
        return b === 0 ? a : gcd(b, a % b);
    }

    // Handle whole numbers
    if (Number.isInteger(decimal)) {
        return `${decimal}:1`;
    }

    // Convert to string to count decimal places
    const decimalStr = decimal.toString();
    const decimalPlaces = decimalStr.split('.')[1]?.length || 0;

    // Create initial fraction
    const denominator = Math.pow(10, decimalPlaces);
    const numerator = Math.round(decimal * denominator);

    // Simplify the fraction
    const commonDivisor = gcd(numerator, denominator);

    return `${numerator / commonDivisor}:${denominator / commonDivisor}`;
}

export const percentFormatter = (value: number) => {
    let val = value;
    if (!val || Number.isNaN(val)) val = 0;
    return `${abbreviateNumber(val * 100)}%`;
};
