import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RiskScoreChart } from './RiskScoreChart';

vi.mock('../../../utils', () => ({
    getScoreLevel: (value: number) => (value < 20 ? 'very_low' : 'low'),
    getScoreLevelColor: (value: number) => (value < 20 ? '#0f0' : '#ff0'),
}));

vi.mock('../../../const/scoreLevelTitles', () => ({
    SCORE_LEVEL_TITLES: {
        very_low: 'Very Low',
        low: 'Low',
    },
}));

describe('RiskScoreChart', () => {
    it('renders title, value text and score level with default medium size', () => {
        render(
            <RiskScoreChart
                title="Risk"
                description="Info"
                value={10}
            />
        );
        expect(
            screen.getByTestId('risk-score-small-charts-item-title')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('risk-score-small-charts-item-score-level')
        ).toHaveTextContent('Very Low');
    });

    it('supports size variants, value prefix/suffix and hides score level', () => {
        render(
            <RiskScoreChart
                title="Risk"
                value={30}
                size="large"
                showScoreLevel={false}
                valuePrefix="$"
                valueSuffix="%"
                scoreValueFormatter={(v) => String(v ?? '')}
            >
                <div data-testid="child" />
            </RiskScoreChart>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(
            screen.queryByTestId('risk-score-small-charts-item-score-level')
        ).not.toBeInTheDocument();
    });
});
