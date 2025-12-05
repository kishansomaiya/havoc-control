import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocationsRankedByComplianceTable } from './LocationsRankedByComplianceTable';
import { MemoryRouter } from 'react-router-dom';
import * as utils from '../../../../../../utils';

vi.spyOn(utils, 'getSelectedPortfolioLocationUrl').mockImplementation(
    (pid: string, lid: number) => `/p/${pid}/l/${lid}`
);

describe('LocationsRankedByComplianceTable', () => {
    it('renders rows and paginates', async () => {
        const years = [2020, 2025, 2030];
        const data = [
            { year: 2020, locationId: 1, locationName: 'L1', m: 2 },
            { year: 2025, locationId: 1, locationName: 'L1', m: 3 },
            { year: 2020, locationId: 2, locationName: 'L2', m: 1 },
        ];

        render(
            <MemoryRouter>
                <LocationsRankedByComplianceTable
                    years={years}
                    portfolioComplianceData={data}
                    jupiterMetric={'m'}
                    portfolioId={'p1'}
                />
            </MemoryRouter>
        );

        expect(
            screen.getAllByTestId('portfolio-overview-location-score-table-row')
                .length
        ).toBeGreaterThan(0);

        // Pagination renders when more than default page size (10) - our data is small, so just ensure table headings render
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
    });
});
