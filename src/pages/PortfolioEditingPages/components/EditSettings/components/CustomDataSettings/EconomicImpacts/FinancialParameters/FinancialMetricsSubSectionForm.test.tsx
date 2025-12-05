import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FinancialMetricsSubSectionForm } from './FinancialMetricsSubSectionForm';
import { DataVersion, Peril } from '../../../../../../../../types';
import { IPortfolio } from '../../../../../../types/portfolio';
import * as formikCtx from '../../../../../../../../hooks/useFormikContextHelpers';

let mockValues: IPortfolio;

beforeEach(() => {
    mockValues = {
        name: 'My Portfolio',
        dataVersion: DataVersion.v3_2_0,
        custom: {
            perilMetrics: {
                perils: [Peril.Heat, Peril.CombinedFlood],
                years: [2020],
                scenarios: ['ssp245'],
            },
            economicImpacts: {
                advancedParameters: {
                    includeWorkerProductivity: true,
                    includeCostOfCooling: true,
                    includeWildfireLoss: true,
                    includeAcuteCombinedFlood: true,
                    includeAcuteWind: true,
                },
                financialParameters: {
                    includeFinancialMetrics: true,
                    financialMetrics: {
                        annualGrowth: 0,
                        annualVolatility: 0,
                        subIndustryCode: '',
                        salesMargin: 0,
                        discountRate: 0,
                        generatePortfolioLevelResults: true,
                    },
                },
            },
        },
    } as unknown as IPortfolio;
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: mockValues,
        setField: vi.fn(),
        setFields: vi.fn(),
        handleBlur: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
});

describe('FinancialMetricsSubSectionForm', () => {
    it('renders include checkbox and all metric fields', () => {
        render(<FinancialMetricsSubSectionForm />);
        expect(
            screen.getByText('Include Financial Metrics')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Annual Growth Rate')).toBeInTheDocument();
        expect(
            screen.getByLabelText('Annual Volatility Rate')
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText('GICS Sub-Industry Code')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Sales Margin')).toBeInTheDocument();
        expect(screen.getByLabelText('Discount Rate')).toBeInTheDocument();
        expect(
            screen.getByText('Generate Portfolio-Level Results')
        ).toBeInTheDocument();
    });

    it('disables inputs when includeFinancialMetrics is false', async () => {
        const fin = mockValues.custom.economicImpacts.financialParameters;
        fin.includeFinancialMetrics = false;
        render(<FinancialMetricsSubSectionForm />);
        expect(screen.getByLabelText('Annual Growth Rate')).toBeDisabled();
        expect(screen.getByLabelText('Annual Volatility Rate')).toBeDisabled();
        expect(screen.getByLabelText('GICS Sub-Industry Code')).toBeDisabled();
        expect(screen.getByLabelText('Sales Margin')).toBeDisabled();
        expect(screen.getByLabelText('Discount Rate')).toBeDisabled();
    });

    it('disables include checkbox when not supported by modules', async () => {
        // No EI modules enabled -> checkFinancialMetricsEnabled=false
        mockValues.custom.economicImpacts.advancedParameters = {
            includeWorkerProductivity: false,
            includeCostOfCooling: false,
            includeWildfireLoss: false,
            includeAcuteCombinedFlood: false,
            includeAcuteWind: false,
        } as unknown as IPortfolio['custom']['economicImpacts']['advancedParameters'];
        // dynamic import with additionalOptions not disabled to ensure the disabled comes from checkFinancialMetricsEnabled
        vi.doMock('../../../../../../../../const', () => ({
            DEFAULT_ECONOMIC_IMPACT_ADDITIONAL_OPTIONS: {
                [DataVersion.v3_2_0]: {
                    includeFinancialMetrics: { disabled: false },
                    generatePortfolioLevelResults: { disabled: false },
                },
            },
            ECONOMIC_IMPACT_DISABLED_OPTIONS: {
                [DataVersion.v3_2_0]: {
                    annualGrowth: false,
                    annualVolatility: false,
                    subIndustryCode: false,
                    salesMargin: false,
                    discountRate: false,
                },
            },
        }));
        const { FinancialMetricsSubSectionForm } = await import(
            './FinancialMetricsSubSectionForm'
        );
        render(<FinancialMetricsSubSectionForm />);
        const include = screen.getByRole('checkbox', {
            name: 'Include Financial Metrics',
        });
        expect(include).toBeDisabled();
    });

    it('marks annualGrowth invalid when touched with errors', async () => {
        vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
            values: mockValues,
            setField: vi.fn(),
            setFields: vi.fn(),
            handleBlur: vi.fn(),
            touched: {
                custom: {
                    economicImpacts: {
                        financialParameters: {
                            financialMetrics: { annualGrowth: true },
                        },
                    },
                },
            },
            errors: {
                custom: {
                    economicImpacts: {
                        financialParameters: {
                            financialMetrics: { annualGrowth: 'Err' },
                        },
                    },
                },
            },
        } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
        render(<FinancialMetricsSubSectionForm />);
        // MUI sets aria-invalid only for certain conditions; assert helper error text instead
        expect(screen.getByText('Err')).toBeInTheDocument();
    });
});
