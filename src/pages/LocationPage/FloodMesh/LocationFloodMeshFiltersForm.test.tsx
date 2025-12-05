import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationFloodMeshFiltersForm } from './components/LocationFloodMeshFiltersForm';
import {
    PerilsOptions,
    ResultSetDataSchema,
} from '../../../api/openapi/auto-generated';
import { Scenario, Score } from '../../../types';
import * as FormikListenerModule from '../../../components/Formik/FormikValuesChangeListener';
import * as ScenarioSelectModule from '../../../components/FormControls/ScenarioSelectFormControl';
import * as YearSelectModule from '../../../components/FormControls/YearSelectFormControl';
import * as MetricSelectModule from '../../../components/FormControls/MetricSelectFormControl';

// Replace module-level mocks with spies providing minimal stubs
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
    vi.spyOn(MetricSelectModule, 'MetricSelectFormControl').mockImplementation(
        (({ initialValue, score }: { initialValue: string; score: Score }) => (
            <div data-testid="metric-control">
                {initialValue}:{score}
            </div>
        )) as unknown as typeof MetricSelectModule.MetricSelectFormControl
    );
});

describe('LocationFloodMeshFiltersForm', () => {
    const resultSetOptions = {
        years: [2020, 2025],
    } as unknown as PerilsOptions;
    const resultSetSchema: Array<ResultSetDataSchema> =
        [] as unknown as Array<ResultSetDataSchema>;

    it('renders controls and triggers onFiltersChange', () => {
        const onFiltersChange = vi.fn();
        render(
            <LocationFloodMeshFiltersForm
                urlFilterParams={{}}
                resultSetOptions={resultSetOptions}
                resultSetSchema={resultSetSchema}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(screen.getByTestId('slp-floodmesh-filters')).toBeInTheDocument();
        expect(screen.getByTestId('scenario-control')).toBeInTheDocument();
        expect(screen.getByTestId('year-control')).toBeInTheDocument();
        expect(screen.getByTestId('metric-control')).toBeInTheDocument();
        expect(onFiltersChange).toHaveBeenCalled();
    });

    it('applies values from urlFilterParams (smoke)', () => {
        const onFiltersChange = vi.fn();
        render(
            <LocationFloodMeshFiltersForm
                urlFilterParams={{
                    metric: 'm1',
                    yearTo: 2030,
                    scenario: Scenario.SSP245,
                }}
                resultSetOptions={resultSetOptions}
                resultSetSchema={resultSetSchema}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(onFiltersChange).toHaveBeenCalled();
    });
});
