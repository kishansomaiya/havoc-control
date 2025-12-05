import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YearSelectFormControl } from './YearSelectFormControl';
import type { PerilsOptions } from '../../api/openapi/auto-generated';

const setFieldValue = vi.fn();

vi.mock('formik', async () => {
    return {
        useFormikContext: () => ({
            values: { yearTo: '' },
            touched: {},
            errors: {},
            handleChange: vi.fn(),
            setFieldValue,
        }),
    };
});

vi.mock('../../hooks/useHazardFilterOptions', () => ({
    useYearSelectOptions: () => [2020, 2025],
    getDefaultYearOptionValue: (arr: number[]) => arr[1],
}));

describe('YearSelectFormControl', () => {
    beforeEach(() => vi.clearAllMocks());
    const resultSetOptions = {} as PerilsOptions;

    it('sets default year via helper', () => {
        render(<YearSelectFormControl resultSetOptions={resultSetOptions} />);
        expect(setFieldValue).toHaveBeenCalledWith('yearTo', 2025);
    });

    it('uses initialValue when helper returns falsy', async () => {
        await vi.resetModules();

        vi.doMock('../../hooks/useHazardFilterOptions', () => ({
            useYearSelectOptions: () => [2020],
            getDefaultYearOptionValue: () => undefined,
        }));

        const Comp = await import('./YearSelectFormControl').then(
            (mod) => mod.YearSelectFormControl
        );

        render(
            <Comp
                resultSetOptions={resultSetOptions}
                initialValue={2020}
            />
        );
        expect(setFieldValue).toHaveBeenCalledWith('yearTo', 2020);
    });
});
