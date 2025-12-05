import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScoringChartLegend } from './ScoringChartLegend';

vi.mock('../../../../../components/Charts/Legend/ChartLegend', () => ({
    ChartLegend: () => <div data-testid="legend" />,
}));

describe('ScoringChartLegend', () => {
    it('renders legend', () => {
        render(<ScoringChartLegend />);
        expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
});
