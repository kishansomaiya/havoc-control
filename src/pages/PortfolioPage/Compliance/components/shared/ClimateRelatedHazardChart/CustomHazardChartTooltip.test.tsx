import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CustomHazardChartTooltipContent } from './CustomHazardChartTooltip';
import type { ChartsAxisContentProps } from '@mui/x-charts/ChartsTooltip/ChartsAxisTooltipContent';

describe('CustomHazardChartTooltipContent', () => {
    it('renders year and series values with percentages', () => {
        const props: Partial<ChartsAxisContentProps> = {
            axisValue: 2025,
            dataIndex: 0,
            series: [
                {
                    id: 's1',
                    label: 'L1',
                    color: '#000',
                    data: [10, 0],
                    getColor: () => '#000',
                    valueFormatter: () => '',
                },
                {
                    id: 's2',
                    label: 'L2',
                    color: '#111',
                    data: [30, 0],
                    getColor: () => '#111',
                    valueFormatter: () => '',
                },
            ] as unknown as ChartsAxisContentProps['series'],
            // Provide minimal stubs for required fields
            axis: {
                id: 'x',
                scaleType: 'linear',
                data: [],
                color: '#000',
            } as unknown as ChartsAxisContentProps['axis'],
            axisData: { x: null, y: null },
            classes: {} as ChartsAxisContentProps['classes'],
        };
        render(
            <CustomHazardChartTooltipContent
                {...(props as ChartsAxisContentProps)}
            />
        );
        expect(screen.getByTestId('chart-tooltip-year')).toHaveTextContent(
            '2025'
        );
        const values = screen.getAllByTestId('chart-tooltip-score-value');
        const percentages = screen.getAllByTestId(
            'chart-tooltip-score-percentage'
        );
        expect(values[0]).toHaveTextContent('10');
        expect(percentages[0]).toHaveTextContent('%');
    });

    it('renders 0 value and 0% when totals are zero and value is null', () => {
        const props2: Partial<ChartsAxisContentProps> = {
            axisValue: 2030,
            dataIndex: 1,
            series: [
                {
                    id: 's1',
                    label: 'A',
                    color: '#000',
                    data: [0, 0],
                    getColor: () => '#000',
                    valueFormatter: () => '',
                },
                {
                    id: 's2',
                    label: 'B',
                    color: '#333',
                    data: [0, 0],
                    getColor: () => '#333',
                    valueFormatter: () => '',
                },
            ] as unknown as ChartsAxisContentProps['series'],
            axis: {
                id: 'x',
                scaleType: 'linear',
                data: [],
                color: '#000',
            } as unknown as ChartsAxisContentProps['axis'],
            axisData: { x: null, y: null },
            classes: {} as ChartsAxisContentProps['classes'],
        };
        render(
            <CustomHazardChartTooltipContent
                {...(props2 as ChartsAxisContentProps)}
            />
        );
        const values = screen.getAllByTestId('chart-tooltip-score-value');
        const percentages = screen.getAllByTestId(
            'chart-tooltip-score-percentage'
        );
        expect(values[0]).toHaveTextContent('0');
        expect(percentages[0]).toHaveTextContent('0%');
    });
});
