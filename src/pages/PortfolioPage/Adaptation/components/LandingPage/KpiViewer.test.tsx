import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiViewer, KpiViewerProps } from './KpiViewer';

const renderComponent = (props: KpiViewerProps) => {
    return render(<KpiViewer {...props} />);
};

describe('KpiViewer', () => {
    const defaultProps: KpiViewerProps = {
        testId: 'kpi-viewer',
        kpis: [
            { name: 'revenue', title: 'Revenue', value: '1000000' },
            {
                name: 'profit',
                title: 'Profit',
                value: '500000',
                showSymbol: true,
            },
            { name: 'customers', title: 'Customers', value: '5000' },
        ],
    };

    it('renders the container with the correct testId', () => {
        renderComponent(defaultProps);
        const container = screen.getByTestId('kpi-viewer');
        expect(container).toBeInTheDocument();
    });

    it('renders the correct number of KPICards', () => {
        renderComponent(defaultProps);

        // Check for title elements of each KPI card
        const kpiTitles = screen.getAllByTestId(/kpi-viewer-.*-title/);
        expect(kpiTitles).toHaveLength(3);
    });

    it('renders KPICards with correct titles', () => {
        renderComponent(defaultProps);

        const revenueTitle = screen.getByTestId('kpi-viewer-revenue-title');
        expect(revenueTitle).toHaveTextContent('Revenue');

        const profitTitle = screen.getByTestId('kpi-viewer-profit-title');
        expect(profitTitle).toHaveTextContent('Profit');

        const customersTitle = screen.getByTestId('kpi-viewer-customers-title');
        expect(customersTitle).toHaveTextContent('Customers');
    });

    it('renders KPICards with correct values', () => {
        renderComponent(defaultProps);

        const revenueValue = screen.getByTestId('kpi-viewer-revenue-children');
        expect(revenueValue).toHaveTextContent('1000000');

        const profitValue = screen.getByTestId('kpi-viewer-profit-children');
        expect(profitValue).toHaveTextContent('500000');

        const customersValue = screen.getByTestId(
            'kpi-viewer-customers-children'
        );
        expect(customersValue).toHaveTextContent('5000');
    });

    it('shows currency symbol only when specified', () => {
        renderComponent(defaultProps);

        // Should have the symbol
        const profitSymbol = screen.getByTestId(
            'kpi-viewer-profit-left-symbol'
        );
        expect(profitSymbol).toHaveTextContent('$');

        // Should not have the symbol
        const revenueSymbol = screen.queryByTestId(
            'kpi-viewer-revenue-left-symbol'
        );
        expect(revenueSymbol).not.toBeInTheDocument();

        const customersSymbol = screen.queryByTestId(
            'kpi-viewer-customers-left-symbol'
        );
        expect(customersSymbol).not.toBeInTheDocument();
    });

    it('renders empty when no kpis are provided', () => {
        renderComponent({ testId: 'kpi-viewer', kpis: [] });
        const container = screen.getByTestId('kpi-viewer');
        expect(container).toBeInTheDocument();

        const kpiTitles = screen.queryAllByTestId(/kpi-viewer-.*-title/);
        expect(kpiTitles).toHaveLength(0);

        const kpiContents = screen.queryAllByTestId(/kpi-viewer-.*-content/);
        expect(kpiContents).toHaveLength(0);
    });

    it('handles custom testId prefix correctly', () => {
        renderComponent({
            testId: 'custom-test-id',
            kpis: [{ name: 'test', title: 'Test', value: '123' }],
        });

        const container = screen.getByTestId('custom-test-id');
        expect(container).toBeInTheDocument();

        const kpiTitle = screen.getByTestId('custom-test-id-test-title');
        expect(kpiTitle).toHaveTextContent('Test');

        const kpiValue = screen.getByTestId('custom-test-id-test-children');
        expect(kpiValue).toHaveTextContent('123');
    });
});
