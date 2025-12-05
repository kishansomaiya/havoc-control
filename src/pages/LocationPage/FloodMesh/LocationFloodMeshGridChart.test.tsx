import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationFloodMeshGridChart } from './components/LocationFloodMeshGridChart';
import {
    MeshOptionsDataVersionEnum,
    ResultSetDataSchema,
} from '../../../api/openapi/auto-generated';
import { ScoreLevel, ScoreLevelCounts } from '../../../types';
import * as windowSizeHook from '../../../hooks/useWindowSize';
import * as locationScoreHook from '../../../hooks/useLocationInScoreLevels';
import * as StyledPieChartModule from '../../../components/Charts/Pie/StyledPieChart';
import * as LegendModule from '../../../components/Charts/Legend/ChartLegend';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(StyledPieChartModule, 'StyledPieChart').mockImplementation((({
        height,
        width,
    }: {
        height: number;
        width: number;
    }) => (
        <div data-testid="pie-chart">
            {height}:{width}
        </div>
    )) as unknown as typeof StyledPieChartModule.StyledPieChart);
    vi.spyOn(LegendModule, 'ChartLegend').mockImplementation((({
        series,
    }: {
        series: unknown[];
    }) => (
        <div data-testid="chart-legend">{series.length}</div>
    )) as unknown as typeof LegendModule.ChartLegend);
});

vi.spyOn(windowSizeHook, 'useWindowSize').mockReturnValue({
    width: 1200,
    height: 900,
});
vi.spyOn(locationScoreHook, 'useLocationInScoreLevels').mockReturnValue({
    locationInScoreLevels: [
        {
            id: ScoreLevel.Low as unknown as number,
            level: 'Low' as unknown as ScoreLevel,
            label: 'Low',
            color: '#000000',
            value: 10,
        },
    ],
});

describe('LocationFloodMeshGridChart', () => {
    it('renders label, description and legend', () => {
        render(
            <LocationFloodMeshGridChart
                selectedMetric={
                    {
                        userGuideDefinition: 'desc',
                        enhancedName: 'name',
                    } as unknown as ResultSetDataSchema
                }
                scoreLevelCounts={
                    {
                        NA: 0,
                        Lowest: 0,
                        Low: 10,
                        Medium: 0,
                        High: 0,
                        Highest: 0,
                    } as unknown as ScoreLevelCounts
                }
                dataVersion={MeshOptionsDataVersionEnum.unknownDefaultOpenApi}
                isFractionMetric={false}
            />
        );
        expect(
            screen.getByTestId('slp-floodmesh-chart-label')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('slp-floodmesh-chart-description')
        ).toHaveTextContent('desc');
        expect(
            screen.getByTestId('slp-floodmesh-chart-legend')
        ).toBeInTheDocument();
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
});
