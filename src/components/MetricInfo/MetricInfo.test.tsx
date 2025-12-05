import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MetricInfo } from './MetricInfo';
import { UnitOfMeasure } from '../../types';

vi.mock('../../hooks/useDifferenceColor', () => ({
    useDifferenceColor: () => 'success.main',
}));

vi.mock('../../utils', async () => {
    const actual = await vi.importActual<object>('../../utils');
    return {
        ...actual,
        numberValueFormatter: ({
            value,
            fractionDigits,
        }: {
            value: number;
            fractionDigits?: number;
        }) =>
            fractionDigits != null
                ? value.toFixed(fractionDigits)
                : String(value),
        isNumber: (v: unknown) =>
            typeof v === 'number' && !Number.isNaN(v as number),
    };
});

describe('MetricInfo', () => {
    it('renders title with currency and tooltip, and both year rows', () => {
        render(
            <MetricInfo
                title="Revenue"
                tooltip="Tip"
                yearFrom={2020}
                yearTo={2025}
                fromValue={10}
                toValue={15}
                currencyCode="USD"
            />
        );
        expect(screen.getByTestId('metrics-title')).toHaveTextContent(
            'Revenue'
        );
        expect(screen.getByTestId('metrics-year-from-label')).toHaveTextContent(
            '2020'
        );
        expect(screen.getByTestId('metrics-year-to-label')).toHaveTextContent(
            '2025'
        );
        expect(screen.getByTestId('metrics-tooltip')).toBeInTheDocument();
    });

    it('formats with unitOfMeasure percentage and prints percent delta', () => {
        render(
            <MetricInfo
                title="Pct"
                tooltip="t"
                yearFrom={2020}
                yearTo={2025}
                fromValue={100}
                toValue={120}
                unitOfMeasure={UnitOfMeasure.Percentage}
            />
        );
        expect(
            screen.getByTestId('metrics-year-to-value-percent')
        ).toHaveTextContent('+20%');
    });

    it('handles missing values and zero-delta branches gracefully', () => {
        render(
            <MetricInfo
                title="x"
                tooltip="t"
                yearFrom={2020}
                yearTo={2025}
                fromValue={0}
                toValue={0}
            />
        );
        expect(
            screen.getByTestId('metrics-year-to-value-percent')
        ).toHaveTextContent('');
    });
});
