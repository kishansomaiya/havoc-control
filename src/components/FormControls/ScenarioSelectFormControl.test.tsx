import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScenarioSelectFormControl } from './ScenarioSelectFormControl';
import type { PerilsOptions } from '../../api/openapi/auto-generated';

const setFieldValue = vi.fn();

vi.mock('formik', async () => {
    return {
        useFormikContext: () => ({
            values: { scenario: '' },
            touched: {},
            errors: {},
            handleChange: vi.fn(),
            setFieldValue,
        }),
    };
});

vi.mock('../../hooks/useHazardFilterOptions', () => ({
    useScenarioSelectOptions: () => [2020, 2025],
    getDefaultScenarioOptionValue: (arr: number[]) => arr[0],
}));

describe('ScenarioSelectFormControl', () => {
    beforeEach(() => vi.clearAllMocks());
    const resultSetOptions = {} as PerilsOptions;

    it('sets default scenario from helper', () => {
        render(
            <ScenarioSelectFormControl resultSetOptions={resultSetOptions} />
        );
        expect(setFieldValue).toHaveBeenCalledWith('scenario', 2020);
        expect(screen.getByTestId('scenario-field-label')).toHaveTextContent(
            'Scenario'
        );
    });

    it('uses initialValue when default is falsy', async () => {
        await vi.resetModules();
        vi.doMock('../../hooks/useHazardFilterOptions', () => ({
            useScenarioSelectOptions: () => [],
            getDefaultScenarioOptionValue: () => '',
        }));
        const Comp = await import('./ScenarioSelectFormControl').then(
            (mod) => mod.ScenarioSelectFormControl
        );
        render(
            <Comp
                resultSetOptions={resultSetOptions}
                initialValue={''}
            />
        );
        expect(setFieldValue).toHaveBeenCalledWith('scenario', '');
    });
});
