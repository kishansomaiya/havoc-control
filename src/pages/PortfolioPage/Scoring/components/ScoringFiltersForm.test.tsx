import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ScoringFiltersForm, ScoringFilterValues } from './ScoringFiltersForm';
import { ComponentProps } from 'react';
import * as BenchmarkControlModule from '../../../../components/FormControls/BenchmarkLevelSelectFormControl';
import * as ScoreSwitcherModule from '../../../../components/ScoreSwitcher/ScoreSwitcher';
import { Score } from '../../../../types';
import { MemoryRouter } from 'react-router-dom';

vi.spyOn(
    BenchmarkControlModule,
    'BenchmarkLevelSelectFormControl'
).mockImplementation(() => <div data-testid="benchmark" />);

vi.spyOn(ScoreSwitcherModule, 'ScoreSwitcher').mockImplementation(
    (props: ComponentProps<typeof ScoreSwitcherModule.ScoreSwitcher>) => (
        <button
            data-testid="score-switcher"
            onClick={() => props.onSelectScore?.(Score.All)}
        />
    )
);

describe('ScoringFiltersForm', () => {
    it('renders score switcher and benchmark control', async () => {
        const user = userEvent.setup();
        const onFiltersChange = vi.fn();
        render(
            <MemoryRouter>
                <ScoringFiltersForm
                    resultSetOptions={{
                        perils: ['cold', 'combinedFlood'],
                        type: 'scores',
                    }}
                    onFiltersChange={onFiltersChange}
                    urlFilterParams={{} as ScoringFilterValues}
                />
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('scoring-score-switcher')
        ).toBeInTheDocument();
        expect(screen.getByTestId('benchmark')).toBeInTheDocument();
        await user.click(screen.getByTestId('score-switcher'));
    });
});
