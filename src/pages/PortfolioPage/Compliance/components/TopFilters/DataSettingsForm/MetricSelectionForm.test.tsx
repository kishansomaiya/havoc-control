import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MetricSelectionForm } from './MetricSelectionForm';
import { EUHazardMetadataWithId } from '../../../../../../hooks/useClimateRelatedHazardCategories';

describe('MetricSelectionForm', () => {
    const euMetrics = [
        { id: 'id1', title: 'M1', show: true },
        { id: 'id2', title: 'M2', show: true },
    ] as EUHazardMetadataWithId[];

    it('selects and deselects all', async () => {
        const user = userEvent.setup();
        const onMetricSelectionChange = vi.fn();
        render(
            <MetricSelectionForm
                euMetrics={euMetrics}
                selectedEUMetrics={[]}
                onMetricSelectionChange={onMetricSelectionChange}
            />
        );
        await user.click(
            screen.getByTestId('data-settings-modal-checkbox-select-all-button')
        );
        expect(onMetricSelectionChange).toHaveBeenCalled();
        await user.click(
            screen.getByTestId('data-settings-modal-checkbox-select-all-button')
        );
        expect(onMetricSelectionChange).toHaveBeenCalled();
    });

    it('toggles a single metric', async () => {
        const user = userEvent.setup();
        const onMetricSelectionChange = vi.fn();
        render(
            <MetricSelectionForm
                euMetrics={euMetrics}
                selectedEUMetrics={[]}
                onMetricSelectionChange={onMetricSelectionChange}
            />
        );
        const first = screen.getAllByTestId(
            'data-settings-modal-checkbox-button'
        )[0];
        await user.click(first);
        expect(onMetricSelectionChange).toHaveBeenCalled();
    });
});
