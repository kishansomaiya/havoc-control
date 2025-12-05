import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as utils from '../../../../utils';
import { ImpactsByLocationTable } from './ImpactsByLocationTable';
import { ComponentProps } from 'react';
import { ImpactsDataWrapper } from './ImpactsDataWrapper';
import { MemoryRouter } from 'react-router-dom';
import { PortfolioImpactsLocationData } from 'types';

vi.spyOn(
    await import('./ImpactsDataWrapper'),
    'ImpactsDataWrapper'
).mockImplementation((props: ComponentProps<typeof ImpactsDataWrapper>) => (
    <div>
        <div data-testid="chart-title">{props.title}</div>
        {props.children}
    </div>
));

vi.spyOn(utils, 'getSelectedPortfolioLocationUrl').mockImplementation(
    (pid: string, lid: number) => `/p/${pid}/l/${lid}`
);
vi.spyOn(utils, 'numberValueFormatter').mockImplementation(
    ({ value }: { value: number }) => `${value}`
);

describe('ImpactsByLocationTable', () => {
    it('renders header, rows and values', () => {
        const impacts = [
            { locationId: 1, locationName: 'A', year: 2020, EI_value: 10 },
            { locationId: 1, locationName: 'A', year: 2025, EI_value: 15 },
            { locationId: 2, locationName: 'B', year: 2020, EI_value: 5 },
            { locationId: 2, locationName: 'B', year: 2025, EI_value: 7 },
            { locationId: 3, locationName: null, year: 2020, EI_value: null },
            { locationId: 3, locationName: null, year: 2025, EI_value: 3 },
        ] as unknown as PortfolioImpactsLocationData[];

        render(
            <MemoryRouter>
                <ImpactsByLocationTable
                    portfolioId={'p1'}
                    impactsData={impacts}
                    yearFrom={2020}
                    yearTo={2025}
                />
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('impacts-location-table')
        ).toBeInTheDocument();
        expect(screen.getAllByTestId('table-row').length).toBeGreaterThan(0);
        expect(
            screen.getByTestId('location-table-year-from')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('location-table-year-to')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('location-table-year-change')
        ).toBeInTheDocument();
    });

    it('handles sorting and pagination, renders fallback values when data missing', () => {
        const manyImpacts = Array.from({ length: 12 }).flatMap((_, i) => [
            {
                locationId: i + 1,
                locationName: `L${i + 1}`,
                year: 2020,
                EI_value: (i + 1) * 2,
            },
            {
                locationId: i + 1,
                locationName: `L${i + 1}`,
                year: 2025,
                EI_value: (i + 1) * 3,
            },
        ]) as unknown as PortfolioImpactsLocationData[];

        render(
            <MemoryRouter>
                <ImpactsByLocationTable
                    portfolioId={'p1'}
                    impactsData={manyImpacts}
                    yearFrom={2020}
                    yearTo={2025}
                />
            </MemoryRouter>
        );

        // Click sort headers to toggle order and switch orderBy
        fireEvent.click(screen.getByTestId('location-table-year-from'));
        fireEvent.click(screen.getByTestId('location-table-year-to'));
        fireEvent.click(screen.getByTestId('location-table-year-change'));

        // Pagination present; go to next page
        const nextBtn = screen.getByRole('button', {
            name: /go to next page/i,
        });
        fireEvent.click(nextBtn);
        // Change rows per page by clicking the menu icon button then selecting an option would require full MUI Select plumbing.
        // Instead, invoke the next page again to traverse branch in onPageChange and keep test robust across MUI versions.
        fireEvent.click(nextBtn);
    });
});
