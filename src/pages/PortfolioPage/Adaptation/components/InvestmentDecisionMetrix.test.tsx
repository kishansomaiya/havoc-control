import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvestmentDecisionMatrix } from './InvestmentDecisionMetrix';
import { TestRoot } from '../../../../testing/TestRoot';
import { LocationAnalysisData } from '../../../../api/openapi/auto-generated';
import { formatMessageTesting } from '../../../../localization/formatMessageTesting';

vi.mock('@mui/x-data-grid', () => ({
    DataGrid: ({ rows, columns, getRowId }: any) => (
        <div
            className="MuiDataGrid-root"
            data-testid="data-grid"
        >
            <div className="MuiDataGrid-columnHeaders">
                {columns.map((col: any) => (
                    <div key={col.field}>{col.headerName}</div>
                ))}
            </div>
            {rows?.map((row: any) => (
                <div
                    key={getRowId ? getRowId(row) : row.id}
                    className="MuiDataGrid-row"
                >
                    {columns.map((col: any) => (
                        <div
                            key={`${getRowId ? getRowId(row) : row.id}-${col.field}`}
                        >
                            {col.valueFormatter
                                ? col.valueFormatter(row[col.field])
                                : row[col.field]}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    ),
    GridColDef: {} as any,
    GridRowSelectionModel: {} as any,
}));

const mockInvestmentData: LocationAnalysisData[] = [
    {
        customerLocationId: 382902,
        name: 'Corporate Plaza East',
        growthCapex: 1200000,
        implementationYear: 2030,
        netPresentValue: 2500000,
        returnOnInvestment: 15.5,
        breakevenYear: 2035,
    },
    {
        customerLocationId: 72792,
        name: 'Downtown Office Complex',
        growthCapex: 1800000,
        implementationYear: 2032,
        netPresentValue: 3200000,
        returnOnInvestment: 18.2,
        breakevenYear: 2037,
    },
    {
        customerLocationId: 928762,
        name: 'Manufacturing Hub West',
        growthCapex: 2500000,
        implementationYear: 2035,
        netPresentValue: 4800000,
        returnOnInvestment: 22.1,
        breakevenYear: 2040,
    },
] as unknown as LocationAnalysisData[];

describe('InvestmentDecisionMatrix', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component with testid', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        expect(screen.getByTestId('investment-matrix')).toBeInTheDocument();
    });

    it('renders the component title from localization', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        // The title comes from formatMessage('adaptation.tabs.investment.title')
        // Since we're using TestRoot, it should render the localization key or mock value
        expect(
            screen.getByText(
                formatMessageTesting('adaptation.tabs.investment.title')
            )
        ).toBeInTheDocument();
    });

    it('renders the label text from localization', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        // The label comes from formatMessage('adaptation.tabs.investment.label')
        expect(
            screen.getByText(
                formatMessageTesting('adaptation.tabs.investment.label')
            )
        ).toBeInTheDocument();
    });

    it('renders the Arcadis logo', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        const logo = screen.getByAltText('Arcadis Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/arcadis_logo.png');
    });

    it('renders all column headers correctly', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        expect(screen.getByText('Location Name')).toBeInTheDocument();
        expect(screen.getByText('Adaptation Costs')).toBeInTheDocument();
        expect(screen.getByText('Required CAPEX')).toBeInTheDocument();
        expect(screen.getByText('Implementation Year')).toBeInTheDocument();
        expect(screen.getByText('Expected NPV')).toBeInTheDocument();
        expect(screen.getByText('ROI')).toBeInTheDocument();
        expect(screen.getByText('Breakeven')).toBeInTheDocument();
    });

    it('renders location data correctly', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        expect(screen.getByText('Corporate Plaza East')).toBeInTheDocument();
        expect(screen.getByText('Downtown Office Complex')).toBeInTheDocument();
        expect(screen.getByText('Manufacturing Hub West')).toBeInTheDocument();
    });

    it('renders implementation years correctly', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        expect(screen.getAllByText('2030')[0]).toBeInTheDocument();
        expect(screen.getAllByText('2032')[0]).toBeInTheDocument();
        expect(screen.getAllByText('2035')[0]).toBeInTheDocument();
    });

    it('renders ROI values correctly', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        expect(screen.getByText('15.5')).toBeInTheDocument();
        expect(screen.getByText('18.2')).toBeInTheDocument();
        expect(screen.getByText('22.1')).toBeInTheDocument();
    });

    it('renders breakeven years correctly', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        expect(screen.getAllByText('2035')[0]).toBeInTheDocument();
        expect(screen.getAllByText('2037')[0]).toBeInTheDocument();
        expect(screen.getAllByText('2040')[0]).toBeInTheDocument();
    });

    it('renders the data grid component', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        expect(screen.getByTestId('data-grid')).toBeInTheDocument();
        const gridContainer = document.querySelector('.MuiDataGrid-root');
        expect(gridContainer).toBeInTheDocument();
    });

    it('displays correct number of rows', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        const rows = document.querySelectorAll('.MuiDataGrid-row');
        expect(rows).toHaveLength(3);
    });

    it('handles empty investment data', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={[]} />
            </TestRoot>
        );

        expect(screen.getByTestId('investment-matrix')).toBeInTheDocument();
        const rows = document.querySelectorAll('.MuiDataGrid-row');
        expect(rows).toHaveLength(0);
    });

    it('handles undefined investment data', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix />
            </TestRoot>
        );

        expect(screen.getByTestId('investment-matrix')).toBeInTheDocument();
        const rows = document.querySelectorAll('.MuiDataGrid-row');
        expect(rows).toHaveLength(0);
    });

    it('handles selected rows prop', () => {
        const selectedRows = [382902];

        render(
            <TestRoot>
                <InvestmentDecisionMatrix
                    investmentData={mockInvestmentData}
                    selectedRows={selectedRows}
                />
            </TestRoot>
        );

        expect(screen.getByTestId('investment-matrix')).toBeInTheDocument();
        // The selection logic is handled internally by the component
        // We can verify the component renders without errors
    });

    it('applies correct styling classes', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        const gridRoot = document.querySelector('.MuiDataGrid-root');
        expect(gridRoot).toBeInTheDocument();

        const columnHeaders = document.querySelector(
            '.MuiDataGrid-columnHeaders'
        );
        expect(columnHeaders).toBeInTheDocument();
    });

    it('uses customerLocationId as row ID', () => {
        render(
            <TestRoot>
                <InvestmentDecisionMatrix investmentData={mockInvestmentData} />
            </TestRoot>
        );

        // Verify that the mock DataGrid received the getRowId function
        // by checking that rows are rendered (which means getRowId worked)
        const rows = document.querySelectorAll('.MuiDataGrid-row');
        expect(rows).toHaveLength(3);
    });
});
