import { render, screen } from '@testing-library/react';
import { ScoreLevelsMapLegend } from './ScoreLevelsMapLegend';
import { describe, it, expect } from 'vitest';

describe('ScoreLevelsMapLegend', () => {
    it('renders with default props', () => {
        render(<ScoreLevelsMapLegend />);
        expect(screen.getByText('Hazard Exposure')).toBeInTheDocument();
        expect(
            screen.getByTestId('score-levels-map-legend')
        ).toBeInTheDocument();
    });

    it('renders with custom title', () => {
        render(<ScoreLevelsMapLegend title="Custom Title" />);
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders lowest and highest labels', () => {
        render(
            <ScoreLevelsMapLegend
                lowestLabel="Low"
                highestLabel="High"
            />
        );
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('renders custom colors', () => {
        const customColors = ['#ff0000', '#00ff00', '#0000ff'];
        render(<ScoreLevelsMapLegend colors={customColors} />);
        const colorElements = screen.getAllByTestId(
            'score-levels-map-legend-value'
        );
        expect(colorElements).toHaveLength(customColors.length);
        customColors.forEach((color, index) => {
            expect(colorElements[index]).toHaveStyle(`background: ${color}`);
        });
    });

    it('hides lowest and highest labels when not provided', () => {
        render(
            <ScoreLevelsMapLegend
                lowestLabel=""
                highestLabel=""
            />
        );
        expect(
            screen.queryByTestId('score-levels-map-legend-score-level-lowest')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId('score-levels-map-legend-score-level-highest')
        ).not.toBeInTheDocument();
    });
});
