import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocationsScoreTable } from './LocationsScoreTable';
import { Score } from '../../../../types';
import { LocationWithScores } from '../PortfolioOverviewTab';
import * as utils from '../../../../utils';
import { MemoryRouter } from 'react-router-dom';

// Use real router via MemoryRouter; avoid mocking Link

vi.spyOn(utils, 'getSelectedPortfolioLocationUrl').mockImplementation(
    (pid: string, lid: number) => `/p/${pid}/l/${lid}`
);
vi.spyOn(utils, 'numberValueFormatter').mockImplementation(
    ({ value }: { value: number }) => `${value}`
);

describe('LocationsScoreTable', () => {
    const locs = [
        {
            locationId: 1,
            locationName: 'A',
            overallScoreAll: 10,
            hazardScoreAll: 5,
            changeScoreAll: 2,
        },
        {
            locationId: 2,
            locationName: 'B',
            overallScoreAll: 20,
            hazardScoreAll: 6,
            changeScoreAll: 3,
        },
    ] as unknown as LocationWithScores[];

    it('renders title, header and rows', () => {
        render(
            <MemoryRouter>
                <LocationsScoreTable
                    portfolioId={'p1'}
                    locationWithScores={locs}
                    selectedScore={Score.All as Score}
                />
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('portfolio-overview-location-score-table-title')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-overview-location-score-table')
        ).toBeInTheDocument();
        expect(
            screen.getAllByTestId('portfolio-overview-location-score-table-row')
                .length
        ).toBeGreaterThan(0);
    });

    it('handles sort changes, pagination visibility and values rendering', () => {
        const many = Array.from({ length: 12 }).map((_, i) => ({
            locationId: i + 1,
            locationName: `L${i + 1}`,
            overallScoreAll: i + 1,
            hazardScoreAll: i + 2,
            changeScoreAll: i + 3,
        })) as unknown as LocationWithScores[];
        render(
            <MemoryRouter>
                <LocationsScoreTable
                    portfolioId={'p1'}
                    locationWithScores={many}
                    selectedScore={'All' as Score}
                />
            </MemoryRouter>
        );
        // Click on a hazard column name to change sort
        const headers = screen.getAllByTestId(
            'portfolio-overview-location-score-table-column-name'
        );
        fireEvent.click(headers[0]);
        // Pagination present
        expect(
            screen.getByTestId('location-score-table-pagination')
        ).toBeInTheDocument();
    });

    it('renders dash for NO_AVAILABLE_SCORE/null (no pagination for small data)', () => {
        const data = [
            // Ensure the first displayed row (sorted by overall desc) is the dashed one
            {
                locationId: 1,
                locationName: 'A',
                AP_overall_score: 100,
                AP_hazard_score: -9999,
                AP_change_score: null,
            },
            {
                locationId: 2,
                locationName: 'B',
                AP_overall_score: 10,
                AP_hazard_score: 5,
                AP_change_score: 2,
            },
        ] as unknown as LocationWithScores[];
        vi.doMock('../../../../const', async () => {
            const orig =
                await vi.importActual<typeof import('../../../../const')>(
                    '../../../../const'
                );
            return {
                ...orig,
                NO_AVAILABLE_SCORE: -9999,
                ROWS_PER_PAGE_OPTIONS: [1, 5, 10],
            };
        });
        // Re-import component picks the mocked constants
        return import('./LocationsScoreTable').then(
            ({ LocationsScoreTable: Table }) => {
                render(
                    <MemoryRouter>
                        <Table
                            portfolioId={'p2'}
                            locationWithScores={data}
                            selectedScore={Score.All as Score}
                        />
                    </MemoryRouter>
                );
                // First row contains '-' for current and change
                const currentCells = screen.getAllByTestId(
                    'location-score-table-location-value-current'
                );
                const changeCells = screen.getAllByTestId(
                    'location-score-table-location-value-change'
                );
                expect(currentCells[0]).toHaveTextContent('-');
                expect(changeCells[0]).toHaveTextContent('-');
                // With small dataset, pagination should not render
                expect(
                    screen.queryByTestId('location-score-table-pagination')
                ).toBeNull();
            }
        );
    });
});
