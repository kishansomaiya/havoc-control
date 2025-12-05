import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    LocationDamageAndLossFiltersForm,
    LocationDamageAndLossFilterValues,
} from './components/LocationDamageAndLossFiltersForm';
import { ImpactType, LossType, Scenario } from '../../../types';
import { PerilsOptions } from '../../../api/openapi/auto-generated';
import * as FormikListenerModule from '../../../components/Formik/FormikValuesChangeListener';
import * as LossTypeSelectModule from '../../../components/FormControls/LossTypeSelectFormControl';
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
        onValuesChange?: (values: LocationDamageAndLossFilterValues) => void;
        values?: LocationDamageAndLossFilterValues;
    }) => {
        onValuesChange?.(values as LocationDamageAndLossFilterValues);
        return null;
    }) as unknown as typeof FormikListenerModule.FormikValuesChangeListener);
    vi.spyOn(
        LossTypeSelectModule,
        'LossTypeSelectFormControl'
    ).mockImplementation((({ initialValue }: { initialValue: LossType }) => (
        <div data-testid="loss-type-control">{initialValue}</div>
    )) as unknown as typeof LossTypeSelectModule.LossTypeSelectFormControl);
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

describe('LocationDamageAndLossFiltersForm', () => {
    const resultSetOptions = {
        years: [2020, 2025],
    } as unknown as PerilsOptions;

    it('renders controls with defaults and calls onFiltersChange on mount', () => {
        const onFiltersChange = vi.fn();
        render(
            <LocationDamageAndLossFiltersForm
                urlFilterParams={{}}
                resultSetOptions={resultSetOptions}
                onFiltersChange={onFiltersChange}
                impactType={ImpactType.Damage}
                data-testid="slp-damage-loss-filters-form"
            />
        );
        expect(
            screen.getByTestId('slp-damage-loss-filters')
        ).toBeInTheDocument();
        expect(screen.getByTestId('loss-type-control')).toBeInTheDocument();
        expect(screen.getByTestId('scenario-control')).toBeInTheDocument();
        expect(screen.getByTestId('year-control')).toBeInTheDocument();
        expect(onFiltersChange).toHaveBeenCalled();
    });

    it('applies values from urlFilterParams (smoke) and triggers onFiltersChange', () => {
        const onFiltersChange = vi.fn();
        render(
            <LocationDamageAndLossFiltersForm
                urlFilterParams={{
                    yearTo: 2030,
                    scenario: Scenario.SSP245,
                    lossType: LossType.Total,
                }}
                resultSetOptions={resultSetOptions}
                impactType={ImpactType.Loss}
                onFiltersChange={onFiltersChange}
            />
        );
        expect(onFiltersChange).toHaveBeenCalled();
    });
});
