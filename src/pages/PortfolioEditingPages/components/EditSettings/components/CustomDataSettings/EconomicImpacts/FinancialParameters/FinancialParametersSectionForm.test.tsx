import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FinancialParametersSectionForm } from './FinancialParametersSectionForm';
import { DataVersion, Peril } from '../../../../../../../../types';
import { IPortfolio } from 'pages/PortfolioEditingPages/types/portfolio';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';
import * as FinancialMetricsSubSectionFormModule from './FinancialMetricsSubSectionForm';

let mockValues: IPortfolio;

beforeEach(() => {
    mockValues = {
        dataVersion: DataVersion.v3_2_0,
        custom: {
            perilMetrics: { perils: [Peril.Heat], years: [], scenarios: [] },
            economicImpacts: {
                financialParameters: {
                    includeFinancialMetrics: false,
                    financialMetrics: {
                        annualGrowth: 0,
                        annualVolatility: 0,
                        subIndustryCode: '',
                        salesMargin: 0,
                        discountRate: 0,
                        generatePortfolioLevelResults: false,
                    },
                },
            },
        },
    } as unknown as IPortfolio;
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: mockValues,
        setField: vi.fn(),
        setFields: vi.fn(),
        handleBlur: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
    vi.spyOn(
        FinancialMetricsSubSectionFormModule,
        'FinancialMetricsSubSectionForm'
    ).mockImplementation((() => (
        <div data-testid="fin-metrics" />
    )) as typeof FinancialMetricsSubSectionFormModule.FinancialMetricsSubSectionForm);
});

describe('FinancialParametersSectionForm', () => {
    it('renders title and nested metrics section', () => {
        render(<FinancialParametersSectionForm />);
        expect(screen.getByText('Financial Parameters')).toBeInTheDocument();
        expect(screen.getByTestId('fin-metrics')).toBeInTheDocument();
    });
});
