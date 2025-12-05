import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    LocationFinancialMetricsFiltersForm,
    LocationFinancialMetricsFilterValues,
} from './components/LocationFinancialMetricsFiltersForm';
import { PerilsOptions } from '../../../api/openapi/auto-generated';
import { FinancialMetricViewType, Scenario } from '../../../types';

import * as FormikListenerModule from '../../../components/Formik/FormikValuesChangeListener';
import * as ViewTypeModule from '../../../components/FormControls/FinancialMetricViewTypeSelectFormControl';
import * as ScenarioSelectModule from '../../../components/FormControls/ScenarioSelectFormControl';
import * as YearSelectModule from '../../../components/FormControls/YearSelectFormControl';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(
        FormikListenerModule,
        'FormikValuesChangeListener'
    ).mockImplementation((({
        onValuesChange,
        values,
    }: {
        onValuesChange?: (values: LocationFinancialMetricsFilterValues) => void;
        values?: LocationFinancialMetricsFilterValues;
    }) => {
        onValuesChange?.(values as LocationFinancialMetricsFilterValues);
        return null;
    }) as unknown as typeof FormikListenerModule.FormikValuesChangeListener);
    vi.spyOn(
        ViewTypeModule,
        'FinancialMetricViewTypeSelectFormControl'
    ).mockImplementation((({
        initialValue,
    }: {
        initialValue: FinancialMetricViewType;
    }) => (
        <div data-testid="viewtype-control">{initialValue}</div>
    )) as unknown as typeof ViewTypeModule.FinancialMetricViewTypeSelectFormControl);
    vi.spyOn(
        ScenarioSelectModule,
        'ScenarioSelectFormControl'
    ).mockImplementation((({
        initialValue,
    }: {
        initialValue: Scenario | '';
    }) => (
        <div data-testid="scenario-control">{initialValue || ''}</div>
    )) as unknown as typeof ScenarioSelectModule.ScenarioSelectFormControl);
    vi.spyOn(YearSelectModule, 'YearSelectFormControl').mockImplementation((({
        initialValue,
    }: {
        initialValue: number | '';
    }) => (
        <div data-testid="year-control">{initialValue?.toString() || ''}</div>
    )) as unknown as typeof YearSelectModule.YearSelectFormControl);
});

describe('LocationFinancialMetricsFiltersForm', () => {
    const resultSetOptions = {
        years: [2020, 2025],
    } as unknown as PerilsOptions;

    it('renders controls and triggers onFiltersChange', () => {
        const onFiltersChange = vi.fn();
        render(
            <LocationFinancialMetricsFiltersForm
                urlFilterParams={{}}
                resultSetOptions={resultSetOptions}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(
            screen.getByTestId('slp-financial-metrics-filters')
        ).toBeInTheDocument();
        expect(screen.getByTestId('viewtype-control')).toBeInTheDocument();
        expect(screen.getByTestId('scenario-control')).toBeInTheDocument();
        expect(screen.getByTestId('year-control')).toBeInTheDocument();
        expect(onFiltersChange).toHaveBeenCalled();
    });

    it('applies values from urlFilterParams (smoke)', () => {
        const onFiltersChange = vi.fn();
        render(
            <LocationFinancialMetricsFiltersForm
                urlFilterParams={{
                    yearTo: 2030,
                    scenario: Scenario.SSP585,
                    viewType: FinancialMetricViewType.MarketRisk,
                }}
                resultSetOptions={resultSetOptions}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(onFiltersChange).toHaveBeenCalled();
    });
});
