import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import * as settingsContext from '../../context/ComplienceDataSettingsContext';
import { SingleCategoryComplianceView } from './SingleCategoryComplianceView';
import { DisclosureCategory } from '../../../../../api/openapi/auto-generated';
import * as HazardMetricSelectorModule from './components/HazardMetricSelector';
import * as ClimateRelatedHazardChartModule from '../shared/ClimateRelatedHazardChart/ClimateRelatedHazardChart';
import * as LocationsRankedByComplianceTableModule from './components/LocationsRankedByComplianceTable';

vi.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    portfolioItem: { id: 'p1', locationCount: 10 },
} as ReturnType<typeof reactRouter.useOutletContext>);

vi.spyOn(settingsContext, 'useComplianceEUMetrics').mockReturnValue([
    'm1',
    'm2',
]);

// Keep vi.mock: constant override requires importActual merge; spy cannot modify readonly exports
vi.mock('../../../../../const', async () => {
    const orig = await vi.importActual<typeof import('../../../../../const')>(
        '../../../../../const'
    );
    return { ...orig, CLIMATE_RELATED_CATEGORY_TITLES: { acute: 'Acute' } };
});

vi.spyOn(HazardMetricSelectorModule, 'HazardMetricSelector').mockImplementation(
    (props: {
        onMetricChange: (metric: {
            name: string;
            tierName: string;
            enhancedName: string;
        }) => void;
    }) => (
        <button
            data-testid="metric-selector"
            onClick={() =>
                props.onMetricChange({
                    name: 'n',
                    tierName: 't',
                    enhancedName: 'E',
                })
            }
        />
    )
);

vi.spyOn(
    ClimateRelatedHazardChartModule,
    'ClimateRelatedHazardChart'
).mockImplementation(() => <div data-testid="chart" />);

vi.spyOn(
    LocationsRankedByComplianceTableModule,
    'LocationsRankedByComplianceTable'
).mockImplementation(() => <div data-testid="ranked-table" />);

describe('SingleCategoryComplianceView', () => {
    it('renders base view and toggles to single metric flow', async () => {
        const user = userEvent.setup();
        render(
            <SingleCategoryComplianceView
                category={'acute' as DisclosureCategory}
                resultSetMetadata={{}}
                years={[2020, 2025]}
                portfolioComplianceData={[]}
            />
        );

        // Initially uses all metrics; table hidden
        expect(screen.queryByTestId('ranked-table')).not.toBeInTheDocument();

        // Select a specific metric via selector and toggle off select all
        await user.click(screen.getByTestId('metric-selector'));
        const toggle = screen.getByTestId(
            'compliance-charts-single-category-select-all-toggle'
        );
        await user.click(toggle);

        // Toggle off "Select all" by clicking the switch label (mocked selector triggers metric selection)
        // Table should appear now
        expect(screen.getByTestId('ranked-table')).toBeInTheDocument();
        expect(screen.getByTestId('chart')).toBeInTheDocument();
    });
});
