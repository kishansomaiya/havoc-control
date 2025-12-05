import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import * as settingsContext from '../../../context/ComplienceDataSettingsContext';
import { LocationExposureByHazardAndYear } from './LocationExposureByHazardAndYear';
import { DisclosureCategory } from 'api/openapi/auto-generated';
import * as ScoreLevelsMapLegendModule from '../../../../../../components/Map/ScoreLevelsMapLegend';
import * as ClimateRelatedHazardChartModule from '../../shared/ClimateRelatedHazardChart/ClimateRelatedHazardChart';

vi.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    portfolioItem: { id: 'p1', locationCount: 10 },
} as unknown as ReturnType<typeof reactRouter.useOutletContext>);

vi.spyOn(settingsContext, 'useComplianceCategories').mockReturnValue([
    'acute' as DisclosureCategory,
    'chronic' as DisclosureCategory,
]);
vi.spyOn(settingsContext, 'useComplianceEUMetrics').mockReturnValue([
    'm1',
    'm2',
]);

// Use targeted spies for leaf UI components
vi.spyOn(ScoreLevelsMapLegendModule, 'ScoreLevelsMapLegend').mockImplementation(
    () => <div data-testid="legend" />
);
vi.spyOn(
    ClimateRelatedHazardChartModule,
    'ClimateRelatedHazardChart'
).mockImplementation(() => <div data-testid="hazard-chart" />);

describe('LocationExposureByHazardAndYear', () => {
    it('renders chart title, charts, and legend', () => {
        render(
            <LocationExposureByHazardAndYear
                years={[2020, 2025]}
                resultSetMetadata={{}}
                portfolioComplianceData={[]}
            />
        );
        expect(
            screen.getByTestId('location-exposure-by-hazard-and-year-title')
        ).toBeInTheDocument();
        expect(
            screen.getAllByTestId('hazard-related-chart').length
        ).toBeGreaterThan(0);
        expect(screen.getAllByTestId('legend').length).toBeGreaterThan(0);
    });
});
