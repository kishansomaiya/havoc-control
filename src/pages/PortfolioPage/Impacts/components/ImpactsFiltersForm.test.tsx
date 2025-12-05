import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImpactsFiltersForm } from './ImpactsFiltersForm';
import { Scenario } from '../../../../types';
import { PerilsOptions } from '../../../../api/openapi/auto-generated';
import { ComponentProps } from 'react';
import { FormikValuesChangeListener } from 'components/Formik/FormikValuesChangeListener';
import * as ScenarioSelectFormControlModule from '../../../../components/FormControls/ScenarioSelectFormControl';
import * as YearSelectFormControlModule from '../../../../components/FormControls/YearSelectFormControl';
import * as ValuesListenerModule from '../../../../components/Formik/FormikValuesChangeListener';

vi.spyOn(
    ScenarioSelectFormControlModule,
    'ScenarioSelectFormControl'
).mockImplementation(() => <div data-testid="scenario-select" />);

vi.spyOn(
    YearSelectFormControlModule,
    'YearSelectFormControl'
).mockImplementation(() => <div data-testid="year-select" />);

vi.spyOn(ValuesListenerModule, 'FormikValuesChangeListener').mockImplementation(
    ({
        values,
        onValuesChange,
    }: ComponentProps<typeof FormikValuesChangeListener>) => {
        onValuesChange?.(values);
        return <div data-testid="values-listener" />;
    }
);

describe('ImpactsFiltersForm', () => {
    it('renders controls and emits values merged with url params', () => {
        const onFiltersChange = vi.fn();
        render(
            <ImpactsFiltersForm
                urlFilterParams={{ yearTo: 2050, scenario: Scenario.SSP585 }}
                resultSetOptions={{} as unknown as PerilsOptions}
                onFiltersChange={onFiltersChange}
                data-testid="impacts-filters-wrapper"
            />
        );

        expect(screen.getByTestId('impacts-filters')).toBeInTheDocument();
        expect(screen.getByTestId('scenario-select')).toBeInTheDocument();
        expect(screen.getByTestId('year-select')).toBeInTheDocument();
        expect(onFiltersChange).toHaveBeenCalled();
        const call = onFiltersChange.mock.calls.at(-1)?.[0];
        expect(call).toMatchObject({ yearTo: 2050, scenario: 'ssp585' });
    });
});
