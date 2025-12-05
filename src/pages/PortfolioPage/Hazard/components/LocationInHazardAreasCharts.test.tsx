import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as useWindowSizeHook from '../../../../hooks/useWindowSize';
import { LocationInHazardAreasCharts } from './LocationInHazardAreasCharts';
import { Score, ScoreLevel, ScoreLevelCounts } from 'types';
import { ResultSetDataSchema } from 'api/openapi/auto-generated';
import { StyledPieChart } from 'components/Charts/Pie/StyledPieChart';
import { ComponentProps } from 'react';
import { DefaultizedPieValueType, PieItemIdentifier } from '@mui/x-charts';
import * as useLocationInScoreLevelsHook from '../../../../hooks/useLocationInScoreLevels';
import * as StyledPieChartModule from '../../../../components/Charts/Pie/StyledPieChart';
import * as ChartLegendModule from '../../../../components/Charts/Legend/ChartLegend';
import * as hazardScoreLevelDescriptionModule from '../../../../const/hazardScoreLevelDescription';

vi.spyOn(useWindowSizeHook, 'useWindowSize').mockReturnValue({
    width: 1200,
    height: 900,
} as ReturnType<typeof useWindowSizeHook.useWindowSize>);

vi.spyOn(
    useLocationInScoreLevelsHook,
    'useLocationInScoreLevels'
).mockReturnValue({
    locationInScoreLevels: [
        { id: 'l', value: 10, level: 'LOW', color: '#111' },
    ],
} as unknown as ReturnType<
    typeof useLocationInScoreLevelsHook.useLocationInScoreLevels
>);

vi.spyOn(StyledPieChartModule, 'StyledPieChart').mockImplementation(
    (props: ComponentProps<typeof StyledPieChart>) => (
        <button
            data-testid="pie"
            onClick={() =>
                props.onSlotClick?.(
                    { x: 10, y: 20 } as unknown as React.MouseEvent<
                        SVGPathElement,
                        MouseEvent
                    >,
                    { type: 'click' } as unknown as PieItemIdentifier,
                    {
                        level: 'LOW' as ScoreLevel,
                        value: 10,
                        id: 'l',
                        label: 'Low',
                        color: '#111',
                        data: { id: 'l', value: 10, level: 'LOW' },
                    } as unknown as DefaultizedPieValueType
                )
            }
        />
    )
);

vi.spyOn(ChartLegendModule, 'ChartLegend').mockImplementation(() => (
    <div data-testid="legend" />
));

vi.spyOn(
    hazardScoreLevelDescriptionModule,
    'getHazardScoreLevelDescription'
).mockReturnValue('desc');

describe('LocationInHazardAreasCharts', () => {
    it('renders labels, pie, legend and handles filter callback', async () => {
        const user = userEvent.setup();
        const onFilter = vi.fn();
        render(
            <LocationInHazardAreasCharts
                score={'Risk' as Score}
                metric={{ userGuideDefinition: 'def' } as ResultSetDataSchema}
                scoreLevelCounts={{} as ScoreLevelCounts}
                onFilterByScoreLevel={onFilter}
            />
        );
        expect(
            screen.getByTestId('portfolio-hazard-chart-label')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-hazard-chart-description')
        ).toHaveTextContent('def');
        expect(screen.getByTestId('legend')).toBeInTheDocument();
        await user.click(screen.getByTestId('pie'));
        expect(onFilter).toHaveBeenCalled();
    });
});
