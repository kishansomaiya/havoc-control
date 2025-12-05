import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as scoringCtx from '../../PrortfolioScoringContext';
import { CustomScatter } from './CustomScatter';

vi.spyOn(scoringCtx, 'useScoringLocationId').mockReturnValue(undefined);

describe('CustomScatter', () => {
    const baseProps = {
        xPos: 0,
        yPos: 0,
        color: '#fff',
        showLocationId: true,
        locations: [
            { locationId: 1, locationName: 'A' },
            { locationId: 2, locationName: 'B' },
        ],
        hazardScoreValue: 10,
        changeScoreValue: 5,
    };

    it('opens short tooltip on hover and full tooltip on click', async () => {
        const user = userEvent.setup();
        render(<CustomScatter {...baseProps} />);
        await user.hover(screen.getByTestId('scatter-chart-item-circle'));
        expect(
            screen.getByTestId('scatter-chart-short-tooltip')
        ).toBeInTheDocument();
        await user.click(screen.getByTestId('scatter-chart-item-circle'));
        expect(screen.getByTestId('scatter-chart-tooltip')).toBeInTheDocument();
    });
});
