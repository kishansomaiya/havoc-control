import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AllCategoriesComplianceView } from './AllCategoriesComplianceView';
import * as LocationExposureModule from './components/LocationExposureByHazardAndYear';
import * as ComplianceHazardScoresTableModule from './components/ComplianceHazardScoresTable';

vi.spyOn(
    LocationExposureModule,
    'LocationExposureByHazardAndYear'
).mockImplementation(() => <div data-testid="location-exposure" />);
vi.spyOn(
    ComplianceHazardScoresTableModule,
    'ComplianceHazardScoresTable'
).mockImplementation(() => <div data-testid="scores-table" />);

describe('AllCategoriesComplianceView', () => {
    it('renders charts and table containers', () => {
        render(
            <AllCategoriesComplianceView
                resultSetMetadata={{}}
                years={[2020, 2025]}
                portfolioComplianceData={[]}
            />
        );
        expect(screen.getByTestId('compliance-charts-all')).toBeInTheDocument();
        expect(screen.getByTestId('location-exposure')).toBeInTheDocument();
        expect(screen.getByTestId('scores-table')).toBeInTheDocument();
    });
});
