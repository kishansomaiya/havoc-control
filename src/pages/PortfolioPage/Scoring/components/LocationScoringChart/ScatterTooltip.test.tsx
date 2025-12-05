import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as scoringCtx from '../../PrortfolioScoringContext';
import { ScatterTooltip } from './ScatterTooltip';

vi.spyOn(scoringCtx, 'useScoringLocationId').mockReturnValue(undefined);

describe('ScatterTooltip', () => {
    it('renders text and navigates through locations', async () => {
        const user = userEvent.setup();
        const onLocationSelected = vi.fn();
        render(
            <ScatterTooltip
                locationIds={[1, 2, 3]}
                hazardScoreValue={10}
                changeScoreValue={5}
                onCloseButtonClick={() => {}}
                onLocationSelected={onLocationSelected}
            />
        );
        expect(
            screen.getByTestId('scatter-chart-tooltip-text')
        ).toBeInTheDocument();
        await user.click(
            screen.getByTestId('scatter-chart-tooltip-right-button')
        );
        expect(onLocationSelected).toHaveBeenCalled();
    });
});
