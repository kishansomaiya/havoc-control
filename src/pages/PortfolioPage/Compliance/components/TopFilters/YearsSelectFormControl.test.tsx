import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { YearsSelectFormControl } from './YearsSelectFormControl';
import { ComponentProps } from 'react';
import { Select } from '@mui/material';

vi.mock('@mui/material/Select', () => ({
    __esModule: true,
    default: (props: ComponentProps<typeof Select>) => (
        <div data-testid="mock-select">
            <div data-testid="select-value">
                {(props.value as number[])?.join(',')}
            </div>
        </div>
    ),
}));

describe('YearsSelectFormControl', () => {
    it('renders with initial chip and label', async () => {
        const onYearsChange = vi.fn();
        render(
            <YearsSelectFormControl
                years={[2025, 2030, 2050]}
                initialValue={[2025]}
                onYearsChange={onYearsChange}
            />
        );
        expect(
            screen.getByTestId('compliance-filters-year')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('compliance-filters-year-label')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('compliance-filters-year-chip')
        ).toBeInTheDocument();
    });
});
