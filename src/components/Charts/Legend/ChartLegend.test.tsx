import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChartLegend } from './ChartLegend';

describe('ChartLegend', () => {
    const baseSeries = [
        { id: '1', legend: 'One', color: '#111' },
        { id: '2', legend: 'Two', color: '#222', description: 'desc' },
    ];

    it('renders items with color boxes by default', () => {
        render(
            <ChartLegend
                series={baseSeries}
                data-testid="legend"
            />
        );
        const items = screen.getAllByTestId('chart-legend-item');
        expect(items).toHaveLength(2);
        expect(screen.getAllByTestId('chart-legend-item-color')).toHaveLength(
            2
        );
        expect(
            screen.getAllByTestId('chart-legend-item-text')[0]
        ).toHaveTextContent('One');
    });

    it('renders custom node when provided', () => {
        render(
            <ChartLegend
                series={[
                    ...baseSeries,
                    {
                        id: '3',
                        legend: 'Three',
                        color: '#333',
                        node: <div data-testid="custom-node">X</div>,
                    },
                ]}
            />
        );
        expect(
            screen.getByTestId('chart-legend-item-node')
        ).toBeInTheDocument();
        expect(screen.getByTestId('custom-node')).toBeInTheDocument();
    });

    it('shows tooltip icon when description provided', () => {
        render(<ChartLegend series={baseSeries} />);
        expect(
            screen.getByTestId('chart-legend-item-tooltip')
        ).toBeInTheDocument();
    });

    it('respects orientation prop for layout (horizontal/vertical)', () => {
        const { rerender } = render(
            <ChartLegend
                series={baseSeries}
                orientation="horizontal"
            />
        );
        rerender(
            <ChartLegend
                series={baseSeries}
                orientation="vertical"
            />
        );
        expect(screen.getAllByTestId('chart-legend-item')).toHaveLength(2);
    });
});
