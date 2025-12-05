import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as hazardCategories from '../../../../../hooks/useClimateRelatedHazardCategories';
import { HazardCategorySelector } from './HazardCategorySelector';
import { DisclosureCategory } from '../../../../../api/openapi/auto-generated';

vi.spyOn(hazardCategories, 'useClimateRelatedHazardCategories').mockReturnValue(
    [
        { id: 'acute', title: 'Acute' } as unknown as {
            id: DisclosureCategory;
            title: string;
        },
        { id: 'chronic', title: 'Chronic' } as unknown as {
            id: DisclosureCategory;
            title: string;
        },
    ]
);

// Use actual constants; no override needed

describe('HazardCategorySelector', () => {
    it('renders categories and toggles selection', async () => {
        const user = userEvent.setup();
        const onCategorySelected = vi.fn();
        render(
            <HazardCategorySelector
                selectedCategory={'all'}
                enabledCategories={['acute' as DisclosureCategory]}
                onCategorySelected={onCategorySelected}
            />
        );
        expect(screen.getByText('All')).toBeInTheDocument();
        await user.click(
            screen.getAllByTestId(
                'compliance-filters-hazard-category-disclosure'
            )[0]
        );
        expect(onCategorySelected).toHaveBeenCalled();
    });

    it('disables non-enabled categories and shows contained variant on selected ones', async () => {
        const user = userEvent.setup();
        const onCategorySelected = vi.fn();
        render(
            <HazardCategorySelector
                selectedCategory={'chronic' as DisclosureCategory}
                enabledCategories={['chronic' as DisclosureCategory]}
                onCategorySelected={onCategorySelected}
            />
        );
        const disclosures = screen.getAllByTestId(
            'compliance-filters-hazard-category-disclosure'
        );
        // First is acute: should be disabled
        expect(disclosures[0]).toBeDisabled();
        // Second is chronic: should be enabled and selected (contained)
        expect(disclosures[1]).not.toBeDisabled();
        await user.click(disclosures[1]);
        expect(onCategorySelected).toHaveBeenCalled();
    });
});
