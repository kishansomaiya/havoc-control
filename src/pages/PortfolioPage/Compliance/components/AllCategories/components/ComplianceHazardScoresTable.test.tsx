import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as settingsCtx from '../../../context/ComplienceDataSettingsContext';
import {
    DisclosureAvailability,
    DisclosureCategory,
} from '../../../../../../api/openapi/auto-generated';

vi.spyOn(settingsCtx, 'useComplianceCategories').mockReturnValue([
    'acute' as DisclosureCategory,
    'chronic' as DisclosureCategory,
]);

vi.doMock('../../../../../../const', async () => {
    const orig = await vi.importActual<
        typeof import('../../../../../../const')
    >('../../../../../../const');
    return {
        ...orig,
        CLIMATE_RELATED_CATEGORY_TITLES: { acute: 'Acute', chronic: 'Chronic' },
        EU_HAZARD_COLOR_BY_TYPE: {
            [DisclosureAvailability.available]: 'green',
            [DisclosureAvailability.riskDriver]: 'yellow',
            [DisclosureAvailability.notAvailable]: 'red',
            [DisclosureAvailability.unknownDefaultOpenApi]: 'gray',
        },
        EU_HAZARD_DESCRIPTION_TITLE_BY_TYPE: {
            [DisclosureAvailability.available]: 'Available',
            [DisclosureAvailability.riskDriver]: 'Risk Driver',
            [DisclosureAvailability.notAvailable]: 'Not Available',
            [DisclosureAvailability.unknownDefaultOpenApi]: 'Unknown',
        },
        getCategoryWithMetricsByType: () => ({
            acute: {
                id: 'acute',
                metrics: [
                    {
                        title: 'M1',
                        subtitle: 'S1',
                        availability: DisclosureAvailability.available,
                    },
                ],
            },
            chronic: { id: 'chronic', metrics: [] },
        }),
    };
});

describe('ComplianceHazardScoresTable', () => {
    it('renders legend, headers and rows', async () => {
        const mod = await import('./ComplianceHazardScoresTable');
        render(<mod.ComplianceHazardScoresTable resultSetMetadata={{}} />);
        expect(
            screen.getByTestId('compliance-eu-hazard-alignment-title')
        ).toBeInTheDocument();
        expect(
            screen.getAllByTestId(
                'compliance-eu-hazard-alignment-table-head-title'
            )
        ).toHaveLength(2);
        expect(
            screen.getAllByTestId(
                'compliance-eu-hazard-alignment-table-body-row'
            ).length
        ).toBeGreaterThan(0);
    });
});
