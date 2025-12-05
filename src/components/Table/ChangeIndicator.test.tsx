import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChangeIndicator } from './ChangeIndicator';
import { UnitOfMeasure } from '../../types';

vi.mock('../../hooks/useDifferenceColor', () => ({
    useDifferenceColor: () => 'success.main',
}));

vi.mock('../../utils', async () => {
    const actual = await vi.importActual<object>('../../utils');
    return {
        ...actual,
        convertToPercentage: (v: number) => v * 100,
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
    };
});

describe('ChangeIndicator', () => {
    it('renders NA when any value is missing', () => {
        render(
            <ChangeIndicator
                previousValue={undefined}
                currentValue={5}
            />
        );
        expect(screen.getByTestId('table-change-indicator')).toHaveTextContent(
            '-'
        );
    });

    it('renders signed difference for numeric values', () => {
        render(
            <ChangeIndicator
                previousValue={5}
                currentValue={7}
            />
        );
        expect(screen.getByTestId('table-change-indicator')).toHaveTextContent(
            '+2'
        );
    });

    it('renders percentage with suffix when unit is percentage', () => {
        render(
            <ChangeIndicator
                previousValue={50}
                currentValue={55}
                unitOfMeasure={UnitOfMeasure.Percentage}
            />
        );
        expect(screen.getByTestId('table-change-indicator')).toHaveTextContent(
            '+500.00%'
        );
    });
});
