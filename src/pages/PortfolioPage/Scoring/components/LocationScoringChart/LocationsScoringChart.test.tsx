import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocationsScoringChart } from './LocationsScoringChart';
import type { LocationScoringData } from '../../../../../api/queries/resultSetsQuery';
import * as CustomScatterModule from './CustomScatter';

const scoringData: LocationScoringData[] = [
    {
        locationId: 1,
        locationName: 'A',
        hazardScoreValue: 10,
        changeScoreValue: 5,
        overallScoreValue: 30,
        latitude: 0,
        longitude: 0,
    },
    {
        locationId: 2,
        locationName: 'B',
        hazardScoreValue: 20,
        changeScoreValue: 5,
        overallScoreValue: 40,
        latitude: 0,
        longitude: 0,
    },
    {
        locationId: 3,
        locationName: 'C',
        hazardScoreValue: 20,
        changeScoreValue: 5,
        overallScoreValue: 40,
        latitude: 0,
        longitude: 0,
    },
];

// Keep vi.mock: external lib component types are complex; provide focused stub
vi.mock('@mui/x-charts', async () => {
    const actual =
        await vi.importActual<typeof import('@mui/x-charts')>('@mui/x-charts');
    return {
        ...actual,
        ScatterChart: ({
            children,
            slots,
        }: {
            children?: React.ReactNode;
            slots?: {
                scatter?: (args: {
                    series: { data: Array<{ x: number; y: number }> };
                    color: string;
                    xScale: (n: number) => number;
                    yScale: (n: number) => number;
                }) => React.ReactNode;
            };
        }) => (
            <div data-testid="scatter-chart-mock">
                {children}
                {/* simulate rendering of series via custom scatter slot */}
                <div data-testid="slot-render">
                    {slots?.scatter?.({
                        series: { data: [{ x: 10, y: 5 }] },
                        color: '#fff',
                        xScale: (n: number) => n,
                        yScale: (n: number) => n,
                    })}
                </div>
            </div>
        ),
        ChartsReferenceLine: ({ x, y }: { x?: number; y?: number }) => (
            <div data-testid="ref-line">{x ?? y}</div>
        ),
    };
});

vi.spyOn(CustomScatterModule, 'CustomScatter').mockImplementation(
    (props: { xPos: number; yPos: number }) => (
        <div
            data-testid="custom-scatter"
            data-x={props.xPos}
            data-y={props.yPos}
        />
    )
);

describe('LocationsScoringChart', () => {
    it('renders label and scatter chart with reference lines', () => {
        render(
            <LocationsScoringChart
                portfolioScoringData={scoringData.slice(0, 1)}
            />
        );
        expect(
            screen.getByTestId('locations-scoring-chart-label')
        ).toHaveTextContent('2020-2050 Change Score');
        expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
        expect(screen.getAllByTestId('ref-line').length).toBe(2);
        // custom scatter rendered via slot once in mock
        expect(screen.getAllByTestId('custom-scatter').length).toBeGreaterThan(
            0
        );
    });

    it('toggles Show Location ID checkbox', () => {
        render(<LocationsScoringChart portfolioScoringData={scoringData} />);
        const toggle = screen.getByRole('checkbox', {
            name: 'Show Location ID',
        });
        fireEvent.click(toggle);
        expect((toggle as HTMLInputElement).checked).toBe(true);
    });
});
