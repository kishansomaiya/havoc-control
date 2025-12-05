import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CapitalExpenditureTimeline from './CapitalExpeditureTimeline';
import { TestRoot } from '../../../../../testing/TestRoot';

const YEARS = [
    2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070, 2075, 2080,
    2085, 2090, 2095, 2100,
];

const ANNUAL_EXPENDITURE = [
    460000, 0, 280000, 780000, 0, 400000, 0, 0, 0, 560000, 470000, 0, 0, 0, 0,
    0,
];

const CUMULATIVE_INVESTMENT = [
    0.1, 0.5, 1.2, 1.5, 2.0, 2.5, 3.0, 3.2, 3.3, 3.4, 3.5, 3.5, 3.5, 3.5, 3.5,
    3.5,
];

describe('CapitalExpenditureChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders chart title', () => {
        render(
            <TestRoot>
                <CapitalExpenditureTimeline
                    years={YEARS}
                    annualExpenditure={ANNUAL_EXPENDITURE}
                    cumulativeInvestment={CUMULATIVE_INVESTMENT}
                />
            </TestRoot>
        );
        expect(
            screen.getByText('Capital Expenditure Timeline')
        ).toBeInTheDocument();
    });

    it('renders the chart container with correct styling', () => {
        render(
            <TestRoot>
                <CapitalExpenditureTimeline
                    years={YEARS}
                    annualExpenditure={ANNUAL_EXPENDITURE}
                    cumulativeInvestment={CUMULATIVE_INVESTMENT}
                />
            </TestRoot>
        );

        const chartContainer = document.querySelector(
            'div[style*="background: rgb(36, 36, 36)"]'
        );
        expect(chartContainer).toBeInTheDocument();
    });

    it('renders the MUI ChartContainer SVG element', () => {
        render(
            <TestRoot>
                <CapitalExpenditureTimeline
                    years={YEARS}
                    annualExpenditure={ANNUAL_EXPENDITURE}
                    cumulativeInvestment={CUMULATIVE_INVESTMENT}
                />
            </TestRoot>
        );

        const svgElement = document.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
    });

    it('renders the chart legend with correct items', () => {
        render(
            <TestRoot>
                <CapitalExpenditureTimeline
                    years={YEARS}
                    annualExpenditure={ANNUAL_EXPENDITURE}
                    cumulativeInvestment={CUMULATIVE_INVESTMENT}
                />
            </TestRoot>
        );

        expect(
            screen.getByText('Annual Capital Expenditure')
        ).toBeInTheDocument();
        expect(screen.getByText('Cumulative Investment')).toBeInTheDocument();
    });

    it('renders legend with correct visual elements', () => {
        render(
            <TestRoot>
                <CapitalExpenditureTimeline
                    years={YEARS}
                    annualExpenditure={ANNUAL_EXPENDITURE}
                    cumulativeInvestment={CUMULATIVE_INVESTMENT}
                />
            </TestRoot>
        );

        const legendItems = document.querySelectorAll(
            'span[style*="background"]'
        );
        expect(legendItems.length).toBeGreaterThanOrEqual(2);

        const blueIndicator = document.querySelector(
            'span[style*="rgb(12, 132, 252)"]'
        );
        expect(blueIndicator).toBeInTheDocument();

        const greenIndicator = document.querySelector(
            'span[style*="rgb(126, 211, 33)"]'
        );
        expect(greenIndicator).toBeInTheDocument();
    });

    it('has correct chart container dimensions and styling', () => {
        render(
            <TestRoot>
                <CapitalExpenditureTimeline
                    years={YEARS}
                    annualExpenditure={ANNUAL_EXPENDITURE}
                    cumulativeInvestment={CUMULATIVE_INVESTMENT}
                />
            </TestRoot>
        );

        const outerContainer = document.querySelector(
            'div[style*="background: rgb(36, 36, 36)"]'
        );
        expect(outerContainer).toBeInTheDocument();

        const chartContainer = document.querySelector(
            'div[style*="position: relative"]'
        );
        expect(chartContainer).toBeInTheDocument();
    });

    it('renders chart with expected data structure', () => {
        render(
            <TestRoot>
                <CapitalExpenditureTimeline
                    years={YEARS}
                    annualExpenditure={ANNUAL_EXPENDITURE}
                    cumulativeInvestment={CUMULATIVE_INVESTMENT}
                />
            </TestRoot>
        );

        const svgElement = document.querySelector('svg');
        expect(svgElement).toBeInTheDocument();

        expect(
            screen.getByText('Capital Expenditure Timeline')
        ).toBeInTheDocument();
    });
});
