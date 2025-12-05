import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EconomicImpactsOptionsForm } from './EconomicImpactsOptionsForm';
import { Peril } from '../../../../../../../types';
import { IPortfolio } from 'pages/PortfolioEditingPages/types/portfolio';
import * as formikCtx from '../../../../../../../hooks/useFormikContextHelpers';
import * as DefaultBuildingAttributesModule from './DefaultBuildingAttributes/DefaultBuildingAttributesSectionForm';
import * as DefaultAssetValuesModule from './DefaultAssetValues/DefaultAssetValuesSectionForm';
import * as AdvancedParametersModule from './AdvancedParameters/AdvancedParametersSectionForm';
import * as FinancialParametersModule from './FinancialParameters/FinancialParametersSectionForm';

const setFieldsMock = vi.fn();
let mockValues: IPortfolio;

beforeEach(() => {
    mockValues = {
        name: 'My Portfolio',
        isEconomicImpactsEnabled: false,
        isPerilMetricsEnabled: false,
        custom: {
            perilMetrics: {
                perils: [Peril.CombinedFlood],
                years: [],
                scenarios: [],
            },
        },
    } as unknown as IPortfolio;
    setFieldsMock.mockReset();
});

beforeEach(() => {
    vi.spyOn(formikCtx, 'useFormikContextHelpers').mockReturnValue({
        values: mockValues,
        setFields: setFieldsMock,
        handleBlur: vi.fn(),
        touched: {},
        errors: {},
    } as unknown as ReturnType<typeof formikCtx.useFormikContextHelpers>);
    vi.spyOn(
        DefaultBuildingAttributesModule,
        'DefaultBuildingAttributesSectionForm'
    ).mockImplementation((() => (
        <div data-testid="ei-default-building" />
    )) as typeof DefaultBuildingAttributesModule.DefaultBuildingAttributesSectionForm);
    vi.spyOn(
        DefaultAssetValuesModule,
        'DefaultAssetValuesSectionForm'
    ).mockImplementation((() => (
        <div data-testid="ei-default-assets" />
    )) as typeof DefaultAssetValuesModule.DefaultAssetValuesSectionForm);
    vi.spyOn(
        AdvancedParametersModule,
        'AdvancedParametersSectionForm'
    ).mockImplementation((() => (
        <div data-testid="ei-advanced" />
    )) as typeof AdvancedParametersModule.AdvancedParametersSectionForm);
    vi.spyOn(
        FinancialParametersModule,
        'FinancialParametersSectionForm'
    ).mockImplementation((() => (
        <div data-testid="ei-financial" />
    )) as typeof FinancialParametersModule.FinancialParametersSectionForm);
});

describe('EconomicImpactsOptionsForm', () => {
    it('renders and enables switch when required perils are present; toggles on', async () => {
        render(<EconomicImpactsOptionsForm />);
        expect(screen.getByText('Economic Impacts')).toBeInTheDocument();
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(setFieldsMock).toHaveBeenCalledWith({
            isEconomicImpactsEnabled: true,
            isPerilMetricsEnabled: true,
        });
    });

    it('forces disable when required perils are absent', () => {
        mockValues.custom.perilMetrics.perils = [];
        render(<EconomicImpactsOptionsForm />);
        expect(setFieldsMock).toHaveBeenCalledWith({
            isEconomicImpactsEnabled: false,
        });
    });
});
