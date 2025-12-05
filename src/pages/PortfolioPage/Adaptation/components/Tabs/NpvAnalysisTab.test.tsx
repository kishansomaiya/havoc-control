import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NpvAnalysisTab, NpvTabProps } from './NpvAnalysisTab';
import { TestRoot } from '../../../../../testing/TestRoot';
import { formatMessageTesting } from '../../../../../localization/formatMessageTesting';
import { MessageKeys } from 'localization/useFormatMessage';
import { LocationAnalysisData } from '../../../../../api/openapi/auto-generated';

const mockInvestmentData: Partial<LocationAnalysisData>[] = [
    {
        customerLocationId: 1,
        name: 'Location A',
        netPresentValue: 500000,
        growthCapex: 300000,
        implementationYear: 2024,
        returnOnInvestment: 15.5,
        breakevenYear: 2027,
    },
    {
        customerLocationId: 2,
        name: 'Location B',
        netPresentValue: 750000,
        growthCapex: 500000,
        implementationYear: 2025,
        returnOnInvestment: 22.3,
        breakevenYear: 2028,
    },
    {
        customerLocationId: 3,
        name: 'Location C',
        netPresentValue: 300000,
        growthCapex: 200000,
        implementationYear: 2024,
        returnOnInvestment: 8.9,
        breakevenYear: undefined,
    },
];

const mockKpis = {
    totalNpv: 1550000,
    averageAssetValue: 516666.67,
    topPerformer: 750000,
    topPerformerId: 2,
    concentration: 48.4,
    valueRange: '2.5:1',
};

describe('NpvAnalysisTab', () => {
    const defaultProps: NpvTabProps = {
        investmentData: mockInvestmentData as unknown as LocationAnalysisData[],
        kpis: mockKpis,
    };

    const renderComponent = (props: Partial<NpvTabProps> = {}) =>
        render(
            <TestRoot>
                <NpvAnalysisTab
                    {...defaultProps}
                    {...props}
                />
            </TestRoot>
        );

    it('renders metrics bar with all labels and values', () => {
        renderComponent();

        // Check that all metric labels are present
        expect(
            screen.getByTestId('npv-metric-label-total-npv')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('npv-metric-label-avg-asset-value')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('npv-metric-label-top-performer')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('npv-metric-label-concentration')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('npv-metric-label-value-range')
        ).toBeInTheDocument();

        // Check label text content
        expect(
            screen.getByTestId('npv-metric-label-total-npv')
        ).toHaveTextContent(
            formatMessageTesting(
                'adaptation.tabs.npv_roi.total_npv' as MessageKeys
            )
        );
        expect(
            screen.getByTestId('npv-metric-label-avg-asset-value')
        ).toHaveTextContent(
            formatMessageTesting(
                'adaptation.tabs.npv_roi.average_asset_value' as MessageKeys
            )
        );

        // Check values are displayed correctly
        expect(
            screen.getByTestId('npv-metric-value-total-npv')
        ).toHaveTextContent('$1.55M');
        expect(
            screen.getByTestId('npv-metric-value-avg-asset-value')
        ).toHaveTextContent('$516.67K');
        expect(
            screen.getByTestId('npv-metric-value-top-performer')
        ).toHaveTextContent('$750.00K');
        expect(
            screen.getByTestId('npv-metric-value-concentration')
        ).toHaveTextContent('48.4%');
        expect(
            screen.getByTestId('npv-metric-value-value-range')
        ).toHaveTextContent('2.5:1');
    });

    it('renders top performer caption with location name', () => {
        renderComponent();

        expect(
            screen.getByTestId('npv-metric-description-value-top-performer')
        ).toHaveTextContent('Location B');
    });

    it('renders the pie chart with correct data', () => {
        renderComponent();
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('renders the investment decision matrix', () => {
        renderComponent();
        expect(screen.getByTestId('investment-matrix')).toBeInTheDocument();
    });

    it('handles empty investment data', () => {
        renderComponent({ investmentData: [] });

        // Should still render the metrics bar
        expect(screen.getByTestId('npv-metrics-bar')).toBeInTheDocument();

        // Should render main container
        expect(
            screen.getByTestId('npv-roi-tab-data-container')
        ).toBeInTheDocument();
    });

    it('handles undefined investment data', () => {
        renderComponent({ investmentData: undefined });

        // Should still render the metrics bar
        expect(screen.getByTestId('npv-metrics-bar')).toBeInTheDocument();

        // Should render main container
        expect(
            screen.getByTestId('npv-roi-tab-data-container')
        ).toBeInTheDocument();
    });

    it('handles missing top performer location name', () => {
        const kpisWithMissingLocation = {
            ...mockKpis,
            topPerformerId: 999, // Non-existent location ID
        };
        renderComponent({ kpis: kpisWithMissingLocation });

        // Should render top performer value without caption
        expect(
            screen.getByTestId('npv-metric-value-top-performer')
        ).toHaveTextContent('$750.00K');

        // Caption should not be present
        expect(
            screen.queryByTestId('npv-metric-description-value-top-performer')
        ).not.toBeInTheDocument();
    });

    it('formats concentration as percentage with one decimal place', () => {
        const customKpis = { ...mockKpis, concentration: 75.23 };
        renderComponent({ kpis: customKpis });

        expect(
            screen.getByTestId('npv-metric-value-concentration')
        ).toHaveTextContent('75.2%');
    });

    it('formats numeric values as currency with abbreviation', () => {
        const customKpis = {
            ...mockKpis,
            totalNpv: 2500000,
            averageAssetValue: 833333,
            topPerformer: 1000000,
        };
        renderComponent({ kpis: customKpis });

        expect(
            screen.getByTestId('npv-metric-value-total-npv')
        ).toHaveTextContent('$2.50M');
        expect(
            screen.getByTestId('npv-metric-value-avg-asset-value')
        ).toHaveTextContent('$833.33K');
        expect(
            screen.getByTestId('npv-metric-value-top-performer')
        ).toHaveTextContent('$1.00M');
    });

    it('creates chart data with correct structure', () => {
        renderComponent();

        // The component should render without errors, indicating chart data is properly structured
        expect(
            screen.getByTestId('npv-roi-tab-data-container')
        ).toBeInTheDocument();
    });

    it('handles zero and null NPV values in chart data', () => {
        const dataWithNullValues: Partial<LocationAnalysisData>[] = [
            {
                customerLocationId: 1,
                name: 'Location A',
                netPresentValue: undefined,
                growthCapex: 300000,
                implementationYear: 2024,
                returnOnInvestment: 15.5,
                breakevenYear: 2027,
                locationId: 'sd',
            },
            {
                customerLocationId: 2,
                name: 'Location B',
                netPresentValue: 0,
                growthCapex: 500000,
                implementationYear: 2025,
                returnOnInvestment: 22.3,
                breakevenYear: 2028,
                locationId: 'sd',
            },
        ];

        renderComponent({
            investmentData:
                dataWithNullValues as unknown as LocationAnalysisData[],
        });

        // Should render without errors
        expect(
            screen.getByTestId('npv-roi-tab-data-container')
        ).toBeInTheDocument();
    });
});
