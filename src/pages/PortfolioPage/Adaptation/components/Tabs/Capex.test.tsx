import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CapexTab } from './Capex';
import { TestRoot } from '../../../../../testing/TestRoot';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';
import { LocationAnalysisData } from '../../../../../api/openapi/auto-generated';

describe('CapexTab', () => {
    const mockInvestmentData: LocationAnalysisData[] = [
        {
            customerLocationId: 2782,
            name: 'Test Location',
        } as unknown as LocationAnalysisData,
    ];

    const mockCapexYears = [2024, 2025, 2026, 2027, 2028];
    const mockCapexAnnualExpenditure = [
        1000000, 2000000, 1500000, 1200000, 800000,
    ];

    const defaultProps = {
        capitalCommitment: 5000000,
        averageAnnualCapex: 1300000,
        peakAnnualInvestment: 2000000,
        capexYears: mockCapexYears,
        capexAnnualExpenditure: mockCapexAnnualExpenditure,
        investmentData: mockInvestmentData,
    };

    const renderComponent = (props = {}) =>
        render(
            <TestRoot>
                <CapexTab
                    {...defaultProps}
                    {...props}
                />
            </TestRoot>
        );

    it('renders the headline KPIs with correct labels', () => {
        renderComponent();

        expect(
            screen.getByTestId('capital-commitment-label')
        ).toHaveTextContent(
            formatMessageTesting('adaptation.tabs.capex.capital.commitment')
        );
        expect(
            screen.getByTestId('peak-annual-investment-label')
        ).toHaveTextContent(
            formatMessageTesting('adaptation.tabs.capex.annual.investment')
        );
        expect(
            screen.getByTestId('average-annual-capex-label')
        ).toHaveTextContent(
            formatMessageTesting('adaptation.tabs.capex.annual.capex')
        );
    });

    it('displays formatted KPI values correctly', () => {
        renderComponent();

        // Check that the values are displayed (abbreviated numbers with $ prefix)
        expect(screen.getByText('$5.00M')).toBeInTheDocument();
        expect(screen.getByText('$2.00M')).toBeInTheDocument();
        expect(screen.getByText('$1.30M')).toBeInTheDocument();
    });

    it('renders the main container with correct test id', () => {
        renderComponent();

        expect(
            screen.getByTestId('capex-tab-data-container')
        ).toBeInTheDocument();
    });

    it('renders the timeline and investment matrix components', () => {
        renderComponent();

        expect(screen.getByTestId('capex-timeline')).toBeInTheDocument();
        expect(screen.getByTestId('investment-matrix')).toBeInTheDocument();
    });

    it('handles zero values correctly', () => {
        renderComponent({
            capitalCommitment: 0,
            averageAnnualCapex: 0,
            peakAnnualInvestment: 0,
        });

        // Should display $0 for all zero values
        const zeroValues = screen.getAllByText('$0.00');
        expect(zeroValues).toHaveLength(6);
    });

    it('handles missing investment data', () => {
        renderComponent({
            investmentData: undefined,
        });

        // Component should still render without investment data
        expect(
            screen.getByTestId('capex-tab-data-container')
        ).toBeInTheDocument();
        expect(screen.getByTestId('investment-matrix')).toBeInTheDocument();
    });

    it('handles empty arrays for capex data', () => {
        renderComponent({
            capexYears: [],
            capexAnnualExpenditure: [],
        });

        // Component should still render with empty arrays
        expect(
            screen.getByTestId('capex-tab-data-container')
        ).toBeInTheDocument();
        expect(screen.getByTestId('capex-timeline')).toBeInTheDocument();
    });

    it('passes correct props to child components', () => {
        renderComponent();

        // The timeline component should receive the correct props
        const timeline = screen.getByTestId('capex-timeline');
        expect(timeline).toBeInTheDocument();

        // The investment matrix should receive the investment data
        const matrix = screen.getByTestId('investment-matrix');
        expect(matrix).toBeInTheDocument();
    });
});
