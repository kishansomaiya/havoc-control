import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
    DisclosureCategory,
    DisclosureType,
} from '../../../../../../api/openapi/auto-generated';

vi.doMock('../../../../../../const', async () => {
    const orig = await vi.importActual<
        typeof import('../../../../../../const')
    >('../../../../../../const');
    return {
        ...orig,
        CLIMATE_RELATED_HAZARD_TYPE_TITLES: {
            [DisclosureType.acute]: 'Acute',
            [DisclosureType.chronic]: 'Chronic',
        },
        getEUMetricsByCategoryAndType: () => [
            {
                metrics: [
                    { name: 'm1', tierName: 't1', enhancedName: 'E1' },
                    { name: 'm2', tierName: 't2', enhancedName: 'E2' },
                ],
            },
        ],
    };
});

describe('HazardMetricSelector', () => {
    it('renders metric groups and selects a metric', async () => {
        const user = userEvent.setup();
        const onMetricChange = vi.fn();
        const mod = await vi.importActual<
            typeof import('./HazardMetricSelector')
        >('./HazardMetricSelector');
        render(
            <mod.HazardMetricSelector
                category={'acute' as DisclosureCategory}
                resultSetMetadata={{}}
                onMetricChange={onMetricChange}
            />
        );
        expect(
            screen.getAllByTestId('metrics-radio-group-title').length
        ).toBeGreaterThan(0);
        const radios = await screen.findAllByTestId(
            'metrics-radio-button-label'
        );
        await user.click(radios[0]);
        expect(onMetricChange).toHaveBeenCalled();
    });
});
