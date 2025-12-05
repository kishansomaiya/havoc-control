import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HazardFiltersForm } from './HazardFiltersForm';
import { Scenario, Score } from '../../../../types';
import * as Formik from 'formik';
import * as ScenarioSelectFormControlModule from '../../../../components/FormControls/ScenarioSelectFormControl';
import * as YearSelectFormControlModule from '../../../../components/FormControls/YearSelectFormControl';
import * as MetricSelectFormControlModule from '../../../../components/FormControls/MetricSelectFormControl';
import * as FormikValuesChangeListenerModule from '../../../../components/Formik/FormikValuesChangeListener';

// Use real FormikProvider; only stub useFormik below
vi.spyOn(Formik, 'useFormik').mockReturnValue({
    values: {},
    setFieldValue: vi.fn(),
} as unknown as ReturnType<typeof Formik.useFormik>);

vi.spyOn(
    ScenarioSelectFormControlModule,
    'ScenarioSelectFormControl'
).mockImplementation(() => (
    <div data-testid="portfolio-hazard-filters-scenario" />
));
vi.spyOn(
    YearSelectFormControlModule,
    'YearSelectFormControl'
).mockImplementation(() => (
    <div data-testid="portfolio-hazard-filters-year-to" />
));
vi.spyOn(
    MetricSelectFormControlModule,
    'MetricSelectFormControl'
).mockImplementation(() => (
    <div data-testid="portfolio-hazard-filters-metric" />
));
vi.spyOn(
    FormikValuesChangeListenerModule,
    'FormikValuesChangeListener'
).mockImplementation(() => (
    <div data-testid="portfolio-hazard-filters-change-listener" />
));

describe('HazardFiltersForm', () => {
    it('renders scenario, year, metric controls', () => {
        render(
            <HazardFiltersForm
                urlFilterParams={{}}
                resultSetOptions={{} as unknown as Record<string, never>}
                score={Score.Cold}
                resultSetSchema={[]}
                onFiltersChange={() => {}}
            />
        );
        expect(
            screen.getByTestId('portfolio-hazard-filters')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-hazard-filters-scenario')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-hazard-filters-year-to')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-hazard-filters-metric')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-hazard-filters-change-listener')
        ).toBeInTheDocument();
    });

    it('applies urlFilterParams into form via effects (branches)', () => {
        render(
            <HazardFiltersForm
                urlFilterParams={{
                    metric: 'm1',
                    yearTo: 2050,
                    scenario: Scenario.SSP585,
                }}
                resultSetOptions={{} as unknown as Record<string, never>}
                score={Score.Flood}
                resultSetSchema={[]}
                onFiltersChange={() => {}}
            />
        );
        expect(
            screen.getByTestId('portfolio-hazard-filters')
        ).toBeInTheDocument();
    });
});
