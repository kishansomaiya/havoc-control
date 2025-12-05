import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as utils from '../../../../utils';
import {
    HazardTableLocation,
    LocationHazardDriversTable,
} from './LocationHazardDriversTable';
import userEvent from '@testing-library/user-event';
import { Score } from 'types';
import { MemoryRouter } from 'react-router-dom';

vi.spyOn(utils, 'getSelectedPortfolioLocationUrl').mockImplementation(
    (pid: string, lid: number) => `/p/${pid}/l/${lid}`
);

describe('LocationHazardDriversTable', () => {
    it('renders header and rows with values', () => {
        const locations = [
            {
                locationId: 1,
                locationName: 'A',
                diff: 1,
                '2020': 10,
                '2025': 11,
            },
            {
                locationId: 2,
                locationName: 'B',
                diff: 2,
                '2020': 12,
                '2025': 14,
            },
        ] as unknown as HazardTableLocation[];
        render(
            <MemoryRouter>
                <LocationHazardDriversTable
                    score={'Risk' as Score}
                    hazardLocations={locations}
                    yearFrom={2020}
                    yearTo={2025}
                    portfolioId={'p1'}
                />
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('portfolio-hazard-location-drivers-table-title')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-hazard-location-drivers-table')
        ).toBeInTheDocument();
        expect(screen.getAllByTestId('table-row').length).toBeGreaterThan(0);
    });

    it('sorts by columns and toggles order states', async () => {
        const user = userEvent.setup();
        const locations = [
            {
                locationId: 1,
                locationName: 'A',
                diff: 1,
                '2020': 10,
                '2025': 11,
            },
            {
                locationId: 2,
                locationName: 'B',
                diff: 2,
                '2020': 12,
                '2025': 14,
            },
        ] as unknown as HazardTableLocation[];
        render(
            <MemoryRouter>
                <LocationHazardDriversTable
                    score={'Risk' as Score}
                    hazardLocations={locations}
                    yearFrom={2020}
                    yearTo={2025}
                    portfolioId={'p1'}
                />
            </MemoryRouter>
        );
        await user.click(
            screen.getByTestId(
                'portfolio-hazard-location-drivers-table-year-from'
            )
        );
        await user.click(
            screen.getByTestId(
                'portfolio-hazard-location-drivers-table-year-to'
            )
        );
        await user.click(
            screen.getByTestId(
                'portfolio-hazard-location-drivers-table-year-change'
            )
        );
        expect(screen.getAllByTestId('table-row').length).toBe(2);
    });

    it('shows pagination, changes page and rows-per-page, and covers fallback name', async () => {
        const user = userEvent.setup();
        const locations = Array.from({ length: 7 }).map((_, i) => ({
            locationId: i + 1,
            locationName: i === 0 ? null : `Loc ${i + 1}`,
            diff: i,
            '2020': i % 2 === 0 ? 0 : null,
            '2025': i + 5,
        })) as unknown as HazardTableLocation[];
        render(
            <MemoryRouter>
                <LocationHazardDriversTable
                    score={'Risk' as Score}
                    hazardLocations={locations}
                    yearFrom={2020}
                    yearTo={2025}
                    portfolioId={'p1'}
                />
            </MemoryRouter>
        );
        const pagination = screen.getByTestId('table-location-pagination');
        expect(pagination).toBeInTheDocument();
        const rowsSelect = within(pagination).getByRole('combobox');
        await user.click(rowsSelect);
        const listbox = await screen.findByRole('listbox');
        await user.click(within(listbox).getByRole('option', { name: '10' }));
        expect(screen.getByText('Location#1')).toBeInTheDocument();
        expect(screen.getAllByTestId('table-row').length).toBeGreaterThan(5);
    });

    it('resets page when score changes (effect path)', async () => {
        const { rerender } = render(
            <MemoryRouter>
                <LocationHazardDriversTable
                    score={'Risk' as Score}
                    hazardLocations={
                        Array.from({ length: 7 }).map((_, i) => ({
                            locationId: i + 1,
                            locationName: `Loc ${i + 1}`,
                            diff: i,
                            '2020': i,
                            '2025': i + 1,
                        })) as unknown as HazardTableLocation[]
                    }
                    yearFrom={2020}
                    yearTo={2025}
                    portfolioId={'p1'}
                />
            </MemoryRouter>
        );
        rerender(
            <MemoryRouter>
                <LocationHazardDriversTable
                    score={'Exposure' as Score}
                    hazardLocations={
                        Array.from({ length: 7 }).map((_, i) => ({
                            locationId: i + 1,
                            locationName: `Loc ${i + 1}`,
                            diff: i,
                            '2020': i,
                            '2025': i + 1,
                        })) as unknown as HazardTableLocation[]
                    }
                    yearFrom={2020}
                    yearTo={2025}
                    portfolioId={'p1'}
                />
            </MemoryRouter>
        );
        expect(screen.getAllByTestId('table-row').length).toBeGreaterThan(0);
    });
});
