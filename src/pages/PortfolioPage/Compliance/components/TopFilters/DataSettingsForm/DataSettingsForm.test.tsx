import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as hazardCategories from '../../../../../../hooks/useClimateRelatedHazardCategories';
import { DataSettingsForm } from './DataSettingsForm';
import { DisclosureType } from '../../../../../../api/openapi/auto-generated';
import { ComponentProps } from 'react';
import * as MetricSelectionFormModule from './MetricSelectionForm';

vi.spyOn(
    hazardCategories,
    'useClimateRelatedHazardCategoryWithMetrics'
).mockReturnValue([
    {
        id: 'acute',
        title: 'Acute',
        types: {
            [DisclosureType.acute]: {
                metrics: [
                    {
                        id: 'id1',
                        title: 'T1',
                        category: 'acute',
                        show: true,
                    },
                ],
            },
            [DisclosureType.chronic]: {
                metrics: [
                    {
                        id: 'id2',
                        title: 'T2',
                        category: 'acute',
                        show: true,
                    },
                ],
            },
        },
    },
] as unknown as ReturnType<
    typeof hazardCategories.useClimateRelatedHazardCategoryWithMetrics
>);

vi.spyOn(MetricSelectionFormModule, 'MetricSelectionForm').mockImplementation(
    (
        props: ComponentProps<
            typeof MetricSelectionFormModule.MetricSelectionForm
        >
    ) => (
        <div>
            <button
                data-testid="metric-select-all"
                onClick={() => props.onMetricSelectionChange(['id1', 'id2'])}
            />
            <button
                data-testid="metric-unselect-all"
                onClick={() => props.onMetricSelectionChange([])}
            />
        </div>
    )
);

describe('DataSettingsForm', () => {
    it('renders category section and toggles metrics/category', async () => {
        const user = userEvent.setup();
        const onSelectedCategoriesChange = vi.fn();
        const onSelectedEUMetricsChange = vi.fn();
        render(
            <DataSettingsForm
                resultSetMetadata={{}}
                currentlyViewedCategory={'all'}
                selectedCategories={[]}
                onSelectedCategoriesChange={onSelectedCategoriesChange}
                selectedEUMetrics={[]}
                onSelectedEUMetricsChange={onSelectedEUMetricsChange}
            />
        );
        expect(
            screen.getByTestId('data-settings-modal-hazards-category-section')
        ).toBeInTheDocument();
        // Toggle select all metrics
        await user.click(screen.getAllByTestId('metric-select-all')[0]);
        expect(onSelectedEUMetricsChange).toHaveBeenCalled();
        // Unselect all metrics
        await user.click(screen.getAllByTestId('metric-unselect-all')[0]);
        expect(onSelectedEUMetricsChange).toHaveBeenCalled();
    });
});
