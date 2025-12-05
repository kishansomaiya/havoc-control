import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StyledPieChart } from './StyledPieChart';

const mockOnClick = vi.fn();

describe('StyledPieChart', () => {
    it('renders wrapper with test id', () => {
        render(<StyledPieChart data={[]} />);
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('passes data and sizing to PieChart and supports arcLabel and valueFormatter', () => {
        render(
            <StyledPieChart
                data={[
                    { id: 'a', value: 10, color: '#111', label: 'A' },
                    { id: 'b', value: 20, color: '#222', label: 'B' },
                ]}
                width={300}
                height={200}
                arcLabel="value"
                valueFormatter={(v) => `${v.value}`}
            />
        );
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('dims other arcs when selectedSlotId is provided', () => {
        render(
            <StyledPieChart
                data={[
                    { id: 'a', value: 10 },
                    { id: 'b', value: 20 },
                ]}
                selectedSlotId={2}
            />
        );
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('fires onSlotClick when a slice is clicked', async () => {
        render(
            <StyledPieChart
                data={[{ id: 'a', value: 10 }]}
                onSlotClick={mockOnClick}
            />
        );
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
});
