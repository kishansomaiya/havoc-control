import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AalLineChart, AalLineChartProps } from './AalLineChart';
import { TestRoot } from '../../../../../testing/TestRoot';

const mockYearLineChart = vi.fn();
vi.mock('../../../../../components/Charts/Line/YearLineChart', () => ({
    YearLineChart: (props: any) => {
        mockYearLineChart(props);
        return (
            <div data-testid="year-line-chart">
                {props.yearsRange.map((year: number) => (
                    <span
                        key={year}
                        data-testid={`year-${year}`}
                    >
                        {year}
                    </span>
                ))}
                {props.series.map((s: any, index: number) => (
                    <span
                        key={index}
                        data-testid={`series-${s.label}`}
                    >
                        {s.label}
                    </span>
                ))}
            </div>
        );
    },
}));

const mockProps: AalLineChartProps = {
    years: [2020, 2026, 2029, 2035, 2042, 2048],
    adaptedLosses: {
        all: [100, 120, 140, 160, 180, 200],
        flooding: [30, 35, 40, 45, 50, 55],
        wind: [25, 30, 35, 40, 45, 50],
        fire: [20, 25, 30, 35, 40, 45],
        heat: [15, 20, 25, 30, 35, 40],
    },
    unadaptedLosses: {
        all: [150, 180, 210, 240, 270, 300],
        flooding: [45, 55, 65, 75, 85, 95],
        wind: [40, 50, 60, 70, 80, 90],
        fire: [35, 45, 55, 65, 75, 85],
        heat: [30, 40, 50, 60, 70, 80],
    },
};

describe('AalLineChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the chart title', () => {
        render(
            <TestRoot>
                <AalLineChart {...mockProps} />
            </TestRoot>
        );
        expect(
            screen.getByText('Average Annual Loss Progression')
        ).toBeInTheDocument();
    });

    it('renders the tab select with correct content', () => {
        render(
            <TestRoot>
                <AalLineChart {...mockProps} />
            </TestRoot>
        );

        expect(screen.getByText('All Perils')).toBeInTheDocument();
        expect(screen.getByText('Flood')).toBeInTheDocument();
        expect(screen.getByText('Wind')).toBeInTheDocument();
        expect(screen.getByText('Wildfire')).toBeInTheDocument();
        expect(screen.getByText('Heat')).toBeInTheDocument();
    });

    it('changes the selected tab when a new one is clicked', async () => {
        render(
            <TestRoot>
                <AalLineChart {...mockProps} />
            </TestRoot>
        );
        const user = userEvent.setup();

        const allPerilsTab = screen.getByRole('tab', { name: 'All Perils' });
        const floodTab = screen.getByRole('tab', { name: 'Flood' });

        expect(allPerilsTab).toHaveAttribute('aria-selected', 'true');
        expect(floodTab).toHaveAttribute('aria-selected', 'false');

        await user.click(floodTab);

        expect(allPerilsTab).toHaveAttribute('aria-selected', 'false');
        expect(floodTab).toHaveAttribute('aria-selected', 'true');
    });

    it('renders the YearLineChart component with expected series labels for all perils', () => {
        render(
            <TestRoot>
                <AalLineChart {...mockProps} />
            </TestRoot>
        );

        expect(mockYearLineChart).toHaveBeenCalledWith(
            expect.objectContaining({
                series: expect.arrayContaining([
                    expect.objectContaining({
                        label: 'Adapted Loss',
                        data: mockProps.adaptedLosses.all,
                        color: '#F28B51',
                        showMark: false,
                    }),
                    expect.objectContaining({
                        label: 'Unadapted Loss',
                        data: mockProps.unadaptedLosses.all,
                        color: '#F7BD98',
                        showMark: false,
                    }),
                ]),
            })
        );
    });

    it('renders YearLineChart with correct years from props', () => {
        render(
            <TestRoot>
                <AalLineChart {...mockProps} />
            </TestRoot>
        );

        expect(mockYearLineChart).toHaveBeenCalledWith(
            expect.objectContaining({
                yearsRange: mockProps.years,
                xAxisPadding: 0,
                xMax: 2050,
                height: 400,
            })
        );
    });

    it('updates chart data when switching between tabs', async () => {
        render(
            <TestRoot>
                <AalLineChart {...mockProps} />
            </TestRoot>
        );
        const user = userEvent.setup();

        // Initially shows all perils data
        expect(mockYearLineChart).toHaveBeenLastCalledWith(
            expect.objectContaining({
                series: expect.arrayContaining([
                    expect.objectContaining({
                        data: mockProps.adaptedLosses.all,
                    }),
                    expect.objectContaining({
                        data: mockProps.unadaptedLosses.all,
                    }),
                ]),
            })
        );

        // Switch to flood tab
        const floodTab = screen.getByRole('tab', { name: 'Flood' });
        await user.click(floodTab);

        // Should now show flood data
        expect(mockYearLineChart).toHaveBeenLastCalledWith(
            expect.objectContaining({
                series: expect.arrayContaining([
                    expect.objectContaining({
                        data: mockProps.adaptedLosses.flooding,
                    }),
                    expect.objectContaining({
                        data: mockProps.unadaptedLosses.flooding,
                    }),
                ]),
            })
        );
    });
});
