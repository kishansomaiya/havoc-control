import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AalBarChart, AalBarChartProps } from './AalBarChart';
import { TestRoot } from '../../../../../testing/TestRoot';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';

describe('AalBarChart', () => {
    const mockProps: AalBarChartProps = {
        years: [2020, 2030, 2040, 2050],
        adaptedLosses: {
            all: [100, 110, 120, 130],
            flooding: [25, 27, 29, 31],
            wind: [30, 33, 36, 39],
            fire: [20, 22, 24, 26],
            heat: [25, 28, 31, 34],
        },
        unadaptedLosses: {
            all: [150, 165, 180, 195],
            flooding: [40, 44, 48, 52],
            wind: [45, 50, 55, 60],
            fire: [35, 39, 43, 47],
            heat: [30, 32, 34, 36],
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders chart title', () => {
        render(
            <TestRoot>
                <AalBarChart {...mockProps} />
            </TestRoot>
        );
        expect(
            screen.getByText('Average Annual Loss Progression')
        ).toBeInTheDocument();
    });

    it('initializes checkboxes with correct state and labels', () => {
        render(
            <TestRoot>
                <AalBarChart {...mockProps} />
            </TestRoot>
        );
        expect(screen.getByTestId('unadapted-legend')).toHaveTextContent(
            formatMessageTesting('adaptation.charts.aal.unadapted')
        );
        expect(screen.getByTestId('adapted-legend')).toHaveTextContent(
            formatMessageTesting('adaptation.charts.aal.adapted')
        );
    });
});
