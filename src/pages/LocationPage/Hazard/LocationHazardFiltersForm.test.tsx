import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationHazardFiltersForm } from './components/LocationHazardFiltersForm';
import { PerilsOptions } from '../../../api/openapi/auto-generated';
import { Scenario } from '../../../types';
import * as FormikListenerModule from '../../../components/Formik/FormikValuesChangeListener';
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
        onValuesChange?: (values: unknown) => void;
        values?: unknown;
    }) => {
        onValuesChange?.(values);
        return null;
    }) as unknown as typeof FormikListenerModule.FormikValuesChangeListener);
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

describe('LocationHazardFiltersForm', () => {
    const resultSetOptions = {
        years: [2020, 2025],
    } as unknown as PerilsOptions;

    it('renders controls and triggers onFiltersChange', () => {
        const onFiltersChange = vi.fn();
        render(
            <LocationHazardFiltersForm
                urlFilterParams={{}}
                resultSetOptions={resultSetOptions}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(
            screen.getByTestId('slp-hazard-filters-scenario')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('slp-hazard-filters-year')
        ).toBeInTheDocument();
        expect(onFiltersChange).toHaveBeenCalled();
    });

    it('applies url params (smoke)', () => {
        const onFiltersChange = vi.fn();
        render(
            <LocationHazardFiltersForm
                urlFilterParams={{ yearTo: 2030, scenario: Scenario.SSP585 }}
                resultSetOptions={resultSetOptions}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(onFiltersChange).toHaveBeenCalled();
    });
});
